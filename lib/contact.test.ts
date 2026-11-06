import { readFileSync } from "node:fs";
import { join } from "node:path";
import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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

// Loads the email HTML into the page so tests can read it like Mason would
const mountHtml = (html: string) => {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  return within(container);
};

afterEach(() => document.body.replaceChildren());

describe("buildContactEmail", () => {
  it("titles the email with the visitor's name and signs the message with their details", () => {
    const { subject, text } = buildContactEmail({ ...valid, name: "  Ada Lovelace " });
    expect(subject).toBe("Portfolio inquiry from Ada Lovelace");
    expect(text).toBe("Let's work on a show together.\n\n— Ada Lovelace\nada@example.com");
  });

  it("shows the visitor's name, email and message in the HTML, with a button to reply", () => {
    const email = mountHtml(buildContactEmail({ ...valid, name: "  Ada Lovelace " }).html);

    expect(email.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(email.getByText("Let's work on a show together.")).toBeInTheDocument();
    expect(email.getByRole("link", { name: "ada@example.com" })).toHaveAttribute(
      "href",
      "mailto:ada@example.com",
    );
    expect(email.getByRole("link", { name: "Reply to Ada Lovelace" })).toHaveAttribute(
      "href",
      `mailto:ada@example.com?subject=${encodeURIComponent("Re: Portfolio inquiry from Ada Lovelace")}`,
    );
  });

  it("shows HTML typed by the visitor as text instead of running it", () => {
    const message = `Hi <script>alert("x")</script> & <b>bold</b>`;
    const name = `Ada "<img src=x>"`;
    const { html } = buildContactEmail({ ...valid, name, message });
    const email = mountHtml(html);

    expect(email.getByText(message)).toBeInTheDocument();
    expect(email.getByText(name)).toBeInTheDocument();
    // Text queries can't prove no element was created, so check the tags directly
    expect(document.querySelector("script, img, b")).toBeNull();
  });

  it("keeps the line breaks the visitor typed", () => {
    const { html } = buildContactEmail({ ...valid, message: "Line one.\r\nLine two.\n\nThanks!" });
    mountHtml(html);

    // innerText isn't in jsdom, so count the <br>s that separate the lines
    const message = screen.getByText(/Line one\./);
    expect(message).toHaveTextContent("Line one.Line two.Thanks!");
    expect(message.querySelectorAll("br")).toHaveLength(3);
  });

  // Email clients can't read CSS variables, so the email repeats token values as hex.
  // This fails if the palette in app/globals.css changes and the email isn't updated.
  it("uses only the site's design-token colors, with the brand purple as its accent", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
    const brand = Object.fromEntries(
      [...css.matchAll(/--color-(brand-\d+):\s*(#[0-9a-f]{6})/gi)].map(([, token, hex]) => [
        token,
        hex.toUpperCase(),
      ]),
    );
    // Tailwind's default neutral scale (docs/design-system.md); not defined in globals.css
    const neutral = ["#FFFFFF", "#F5F5F5", "#E5E5E5", "#737373", "#404040", "#262626"];

    const used = [...buildContactEmail(valid).html.matchAll(/#[0-9a-f]{6}\b/gi)].map(([hex]) =>
      hex.toUpperCase(),
    );

    expect(brand["brand-600"]).toMatch(/^#[0-9A-F]{6}$/);
    expect(used).toContain(brand["brand-600"]);
    for (const hex of used) expect([...Object.values(brand), ...neutral]).toContain(hex);
  });
});
