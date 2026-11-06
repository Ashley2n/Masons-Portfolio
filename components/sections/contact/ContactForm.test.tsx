import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { contactContent } from "@/content/contact";
import { contactInfo } from "@/content/site";
import type { ContactSend, ContactSendResult } from "@/lib/contact";
import ContactForm from "./ContactForm";

const { errors } = contactContent.form;
// Agreed with Ashley 2026-10-31; a literal so the test can't pass by echoing the content file
const SENT = "Thanks, your message is on its way. I'll get back to you as soon as possible.";

const setup = () => {
  const send = vi.fn<ContactSend>().mockResolvedValue({ ok: true });
  const user = userEvent.setup();
  render(<ContactForm send={send} />);
  const fields = {
    name: screen.getByLabelText("Name"),
    email: screen.getByLabelText("Email"),
    message: screen.getByLabelText("Message"),
    submit: screen.getByRole("button", { name: "Send message" }),
  };
  /** Fills in a valid message (or the values given) and presses Send. */
  const fillAndSubmit = async ({
    name = "Ada",
    email = "ada@example.com",
    message = "Would love to collaborate.",
  } = {}) => {
    await user.type(fields.name, name);
    await user.type(fields.email, email);
    await user.type(fields.message, message);
    await user.click(fields.submit);
  };
  return { send, user, fillAndSubmit, ...fields };
};

describe("ContactForm", () => {
  it("labels every field and helps browsers autofill", () => {
    const { name, email, message } = setup();

    expect(name).toHaveAttribute("autocomplete", "name");
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
    expect(message.tagName).toBe("TEXTAREA");
  });

  it("shows linked errors, focuses the first problem and sends nothing when empty", async () => {
    const { user, send, name, email, message, submit } = setup();

    await user.click(submit);

    for (const [field, text] of [
      [name, errors.nameRequired],
      [email, errors.emailRequired],
      [message, errors.messageRequired],
    ] as const) {
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(text);
    }
    expect(name).toHaveFocus();
    expect(send).not.toHaveBeenCalled();
  });

  it("clears an error once the field is fixed", async () => {
    const { user, name, submit } = setup();

    await user.click(submit);
    await user.type(name, "Ada");

    expect(name).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(errors.nameRequired)).not.toBeInTheDocument();
  });

  it("flags an invalid email address", async () => {
    const { user, email, submit } = setup();

    await user.type(email, "ada@");
    await user.click(submit);

    expect(email).toHaveAccessibleDescription(errors.emailInvalid);
  });

  it("sends the visitor's values with an empty honeypot and the time the form loaded, then confirms", async () => {
    // Fake only Date (timers stay real so userEvent works): the form loads at 1 s and is sent at 10 s
    vi.useFakeTimers({ toFake: ["Date"], now: 1_000 });
    try {
      const { send, fillAndSubmit } = setup();
      vi.setSystemTime(10_000);

      await fillAndSubmit({ name: "Ada Lovelace", message: "Would love to collaborate on a show." });

      expect(send).toHaveBeenCalledExactlyOnceWith({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Would love to collaborate on a show.",
        website: "",
        startedAt: 1_000,
      });

      await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(SENT));
    } finally {
      vi.useRealTimers();
    }
  });

  it("hides the honeypot from screen readers, the keyboard and autofill", async () => {
    const { user, message, submit } = setup();

    // Not in the accessibility tree: only name, email and message are text boxes
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    // The one thing the tree can't show: the bot-only input exists, is aria-hidden and opts out of autofill
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
    // Tabbing out of the message goes straight to Send, skipping the honeypot
    await user.click(message);
    await user.tab();
    expect(submit).toHaveFocus();
  });

  it("passes on whatever a bot types into the honeypot, so the server can reject it", async () => {
    const { user, send, fillAndSubmit } = setup();
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]')!;

    await user.type(honeypot, "https://spam.example");
    await fillAndSubmit();

    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0].website).toBe("https://spam.example");
  });

  it("waits for the send to finish before confirming", async () => {
    const { user, send, fillAndSubmit } = setup();
    let finish!: (result: ContactSendResult) => void;
    send.mockReturnValue(new Promise((resolve) => (finish = resolve)));

    await fillAndSubmit();

    // Announced to screen readers, and the button stays focusable so keyboard users keep their place
    expect(screen.getByRole("status")).toHaveTextContent("Sending…");
    const sending = screen.getByRole("button", { name: "Sending…" });
    expect(sending).toHaveFocus();
    expect(sending).toHaveAttribute("aria-disabled", "true");
    await user.click(sending);
    expect(send).toHaveBeenCalledOnce();

    finish({ ok: true });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(SENT));
  });

  it("offers Mason's email as a link when the send fails", async () => {
    const { send, submit, fillAndSubmit } = setup();
    send.mockResolvedValue({ ok: false });

    await fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        `Sorry, your message didn't send. Please email me directly at ${contactInfo.email}.`,
      ),
    );
    expect(screen.getByRole("link", { name: contactInfo.email })).toHaveAttribute(
      "href",
      `mailto:${contactInfo.email}`,
    );
    expect(submit).toBeEnabled();
  });

  it("shows the failure message when the send throws (e.g. the network drops)", async () => {
    const { send, submit, fillAndSubmit } = setup();
    send.mockRejectedValue(new Error("Failed to fetch"));

    await fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Sorry, your message didn't send."),
    );
    expect(submit).toBeEnabled();
  });

  it("keeps the fields read-only while sending, so the confirmation matches what was sent", async () => {
    const { user, send, message, fillAndSubmit } = setup();
    let finish!: (result: ContactSendResult) => void;
    send.mockReturnValue(new Promise((resolve) => (finish = resolve)));

    await fillAndSubmit();
    await user.type(message, " Also, one more thing.");

    expect(message).toHaveValue("Would love to collaborate.");
    finish({ ok: true });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(SENT));
    await user.type(message, " One more thing.");
    expect(message).toHaveValue("Would love to collaborate. One more thing.");
  });

  it("tells assistive tech every field is required", () => {
    const { name, email, message } = setup();

    for (const field of [name, email, message]) {
      expect(field).toHaveAttribute("aria-required", "true");
    }
  });

  it("clears the 'sent' confirmation once the visitor edits the form again", async () => {
    const { user, message, fillAndSubmit } = setup();

    await fillAndSubmit();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(SENT));

    await user.type(message, " Also, one more thing.");
    expect(screen.getByRole("status")).toHaveTextContent(contactContent.form.note);
  });
});
