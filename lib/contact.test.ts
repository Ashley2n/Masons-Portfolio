import { describe, expect, it } from "vitest";
import { contactContent } from "@/content/contact";
import { buildContactEmail, hasErrors, validateContact } from "./contact";

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

  it("caps the message at 1,500 characters, as the error copy promises", () => {
    expect(errors.messageTooLong).toEqual(expect.any(String));
    expect(validateContact({ ...valid, message: "a".repeat(1500) }).message).toBeUndefined();
    expect(validateContact({ ...valid, message: "a".repeat(1501) }).message).toBe(
      errors.messageTooLong,
    );
  });

  it("asks for a slightly longer message", () => {
    expect(validateContact({ ...valid, message: "Hi there" }).message).toBe(errors.messageTooShort);
  });
});

describe("buildContactEmail", () => {
  it("titles the email with the visitor's name and signs the message with their details", () => {
    expect(buildContactEmail({ ...valid, name: "  Ada Lovelace " })).toEqual({
      subject: "Portfolio inquiry from Ada Lovelace",
      text: "Let's work on a show together.\n\n— Ada Lovelace\nada@example.com",
    });
  });
});
