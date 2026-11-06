import { describe, expect, it, vi } from "vitest";
import { contactInfo } from "@/content/site";
import { sendContactMessage, type ContactMailer } from "./send-contact-message";

// Fixed clock: the form loaded at 1_000 ms and this is submitted at 10_000 ms (9 s later, past the 3 s minimum)
const NOW = 10_000;
const visitor = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Would love to collaborate on a show.",
  website: "",
  startedAt: 1_000,
};

const setup = ({ apiKey = "re_test_key" }: { apiKey?: string } = {}) => {
  const send = vi.fn<ContactMailer["emails"]["send"]>().mockResolvedValue({ error: null });
  const createMailer = vi.fn((): ContactMailer => ({ emails: { send } }));
  const logError = vi.fn();
  const deliver = (input: unknown) => sendContactMessage(input, { apiKey, createMailer, logError, now: () => NOW });
  return { send, createMailer, logError, deliver };
};

describe("sendContactMessage", () => {
  it("answers a filled honeypot with the normal success reply but sends nothing and logs nothing", async () => {
    const { send, createMailer, logError, deliver } = setup();

    await expect(deliver({ ...visitor, website: "https://spam.example" })).resolves.toEqual({ ok: true });

    expect(createMailer).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it.each([
    ["sent 2.999 seconds after the form loaded", { startedAt: NOW - 2_999 }],
    ["missing the load time", { startedAt: undefined }],
    ["claiming a load time in the future", { startedAt: NOW + 5_000 }],
  ])("answers a submission %s with success but sends nothing", async (_case, override) => {
    const { send, createMailer, deliver } = setup();

    await expect(deliver({ ...visitor, ...override })).resolves.toEqual({ ok: true });

    expect(createMailer).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("checks for spam before validating, so a bot sending invalid values still gets the success reply", async () => {
    const { send, deliver } = setup();

    await expect(deliver({ ...visitor, website: "x", email: "not-an-email" })).resolves.toEqual({ ok: true });

    expect(send).not.toHaveBeenCalled();
  });

  it("emails Mason HTML and plain text from Resend's onboarding sender, with Reply-To set to the visitor", async () => {
    const { send, deliver } = setup();

    await expect(deliver(visitor)).resolves.toEqual({ ok: true });

    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    expect(email.to).toBe(contactInfo.email);
    expect(email.from).toMatch(/<onboarding@resend\.dev>$/);
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.subject).toBe("Portfolio inquiry from Ada Lovelace");
    expect(email.text).toContain("Would love to collaborate on a show.");
    expect(email.html).toContain("Would love to collaborate on a show.");
  });

  it("keeps line breaks in the message and accepts a 100-character name", async () => {
    const { send, deliver } = setup();
    const input = { ...visitor, name: "A".repeat(100), message: "Line one.\r\nLine two.\n\nThanks!" };

    await expect(deliver(input)).resolves.toEqual({ ok: true });

    expect(send.mock.calls[0][0].text).toContain("Line two.");
  });

  it.each([
    ["a missing name", { ...visitor, name: "  " }],
    ["an invalid email", { ...visitor, email: "ada@" }],
    ["a too-short message", { ...visitor, message: "hi" }],
    ["a non-string field", { ...visitor, message: 42 }],
    ["something that isn't a form at all", "DROP TABLE"],
    // A real browser form can't send these; a direct POST to the action can
    ["a name over 100 characters", { ...visitor, name: "A".repeat(101) }],
    ["a line break in the name (it goes into the subject)", { ...visitor, name: "Ada\r\nBcc: x@y.z" }],
    ["a control character in the message", { ...visitor, message: "Would love to collaborate.\u0000" }],
    ["an email over 254 characters", { ...visitor, email: `${"a".repeat(250)}@x.io` }],
    ["a list of addresses as the email", { ...visitor, email: "ada@example.com,eve@example.com" }],
    ["a display name in the email", { ...visitor, email: '"Ada"<ada@example.com>' }],
    ["nothing", undefined],
  ])("rejects %s without contacting Resend", async (_case, input) => {
    const { send, createMailer, deliver } = setup();

    await expect(deliver(input)).resolves.toEqual({ ok: false });

    expect(createMailer).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  describe("when sending fails", () => {
    // The log must say something went wrong without naming who wrote or what they said
    const expectLoggedWithoutVisitorData = (logError: ReturnType<typeof vi.fn>) => {
      expect(logError).toHaveBeenCalledOnce();
      const logged = JSON.stringify(logError.mock.calls);
      for (const secret of ["Ada", "ada@example.com", "collaborate"]) {
        expect(logged).not.toContain(secret);
      }
    };

    it("fails safely when the API key is missing", async () => {
      const { createMailer, logError, deliver } = setup({ apiKey: "" });

      await expect(deliver(visitor)).resolves.toEqual({ ok: false });

      expect(createMailer).not.toHaveBeenCalled();
      expectLoggedWithoutVisitorData(logError);
    });

    it("reports failure when Resend returns an error", async () => {
      const { send, logError, deliver } = setup();
      send.mockResolvedValue({
        error: { name: "validation_error", statusCode: 403, message: "Cannot send to ada@example.com" },
      } as Awaited<ReturnType<ContactMailer["emails"]["send"]>>);

      await expect(deliver(visitor)).resolves.toEqual({ ok: false });

      expectLoggedWithoutVisitorData(logError);
      expect(JSON.stringify(logError.mock.calls)).toContain("validation_error");
    });

    it("reports failure when the request to Resend throws", async () => {
      const { send, logError, deliver } = setup();
      send.mockRejectedValue(new Error("connect ECONNREFUSED while sending for ada@example.com"));

      await expect(deliver(visitor)).resolves.toEqual({ ok: false });

      expectLoggedWithoutVisitorData(logError);
    });
  });
});
