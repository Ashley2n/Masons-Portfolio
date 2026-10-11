import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { contactContent } from "@/content/contact";
import { contactInfo } from "@/content/site";
import ContactForm from "./ContactForm";

const { errors } = contactContent.form;

const setup = () => {
  const send = vi.fn();
  const user = userEvent.setup();
  render(<ContactForm send={send} />);
  return {
    send,
    user,
    name: screen.getByLabelText("Name"),
    email: screen.getByLabelText("Email"),
    message: screen.getByLabelText("Message"),
    submit: screen.getByRole("button", { name: "Send message" }),
  };
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

  it("opens the email app with the message and confirms with a fallback address", async () => {
    const { user, send, name, email, message, submit } = setup();

    await user.type(name, "Ada Lovelace");
    await user.type(email, "ada@example.com");
    await user.type(message, "Would love to collaborate on a show.");
    await user.click(submit);

    expect(send).toHaveBeenCalledOnce();
    const url = new URL(send.mock.calls[0][0]);
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe(contactInfo.email);
    expect(url.searchParams.get("body")).toContain("Would love to collaborate on a show.");

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(contactInfo.email);
    expect(screen.getByRole("link", { name: contactInfo.email })).toHaveAttribute(
      "href",
      `mailto:${contactInfo.email}`,
    );
  });

  it("tells assistive tech every field is required", () => {
    const { name, email, message } = setup();

    for (const field of [name, email, message]) {
      expect(field).toHaveAttribute("aria-required", "true");
    }
  });

  it("clears the 'sent' confirmation once the visitor edits the form again", async () => {
    const { user, name, email, message, submit } = setup();

    await user.type(name, "Ada");
    await user.type(email, "ada@example.com");
    await user.type(message, "Would love to collaborate.");
    await user.click(submit);
    expect(screen.getByRole("status")).toHaveTextContent(contactInfo.email);

    await user.type(message, " Also, one more thing.");
    expect(screen.getByRole("status")).toHaveTextContent(contactContent.form.note);
  });
});
