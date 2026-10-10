import { describe, expect, it } from "vitest";
import { contactContent } from "@/content/contact";
import { buildMailtoUrl, hasErrors, validateContact } from "./contact";

const { errors } = contactContent.form;
const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Let's work on a show together." };

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
    expect(hasErrors(validateContact(valid))).toBe(false);
  });

  it("requires every field, ignoring surrounding spaces", () => {
    expect(validateContact({ name: "  ", email: "", message: " " })).toEqual({
      name: errors.nameRequired,
      email: errors.emailRequired,
      message: errors.messageRequired,
    });
  });

  it.each(["ada", "ada@", "@example.com", "ada@example", "ada example@x.com"])(
    "rejects the invalid email %s",
    (email) => {
      expect(validateContact({ ...valid, email }).email).toBe(errors.emailInvalid);
    },
  );

  it("asks for a slightly longer message", () => {
    expect(validateContact({ ...valid, message: "Hi there" }).message).toBe(errors.messageTooShort);
  });
});

describe("buildMailtoUrl", () => {
  it("addresses Mason with an encoded subject and body", () => {
    const url = buildMailtoUrl(valid, "mason@example.com");
    const parsed = new URL(url);

    expect(parsed.protocol).toBe("mailto:");
    expect(parsed.pathname).toBe("mason@example.com");
    expect(parsed.searchParams.get("subject")).toBe("Portfolio inquiry from Ada Lovelace");
    expect(parsed.searchParams.get("body")).toBe(
      "Let's work on a show together.\n\n— Ada Lovelace\nada@example.com",
    );
  });

  it("encodes spaces as %20 (some mail apps show + literally) and escapes & and ?", () => {
    const url = buildMailtoUrl({ ...valid, name: "A & B?", message: "Rock & roll? Yes!" }, "m@x.com");

    expect(url).not.toContain("+");
    expect(url).toContain("A%20%26%20B%3F");
    expect(new URL(url).searchParams.get("body")).toContain("Rock & roll? Yes!");
  });
});
