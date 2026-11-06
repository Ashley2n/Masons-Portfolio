import "server-only";
import type { CreateEmailOptions } from "resend";
import { contactContent } from "@/content/contact";
import { contactInfo } from "@/content/site";
import {
  buildContactEmail,
  hasErrors,
  validateContact,
  type ContactSendResult,
  type ContactValues,
} from "@/lib/contact";

/** The slice of the Resend client this module uses, so tests can pass a fake. */
export type ContactMailer = {
  emails: {
    send: (email: CreateEmailOptions) => Promise<{ error: { name: string; statusCode: number | null } | null }>;
  };
};

type Deps = {
  apiKey: string | undefined;
  createMailer: (apiKey: string) => ContactMailer;
  logError: (message: string, detail?: Record<string, unknown>) => void;
};

// Until Mason verifies a domain, Resend only sends from its onboarding address (D-19).
const FROM = `${contactContent.form.emailFromName} <onboarding@resend.dev>`;

// Anyone can call a server action directly, so the input is untrusted until checked.
const parseContactValues = (input: unknown): ContactValues | null => {
  if (typeof input !== "object" || input === null) return null;
  const { name, email, message } = input as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") return null;
  return { name, email, message };
};

// Limits a browser form never hits but a direct POST could (agreed with Ashley 2026-10-31).
// 254 is the longest address SMTP can deliver to (RFC 5321 path limit minus the brackets).
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
// The name lands in the subject, so no line breaks; the message may keep \n, \r and \t
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
// Keeps Reply-To a single bare address: no display name, no list
const ADDRESS_SPECIALS = /[,;<>"()[\]\\]/;

const isSafeToEmail = ({ name, email, message }: ContactValues) =>
  name.trim().length <= MAX_NAME_LENGTH &&
  !CONTROL_CHARS.test(name) &&
  email.trim().length <= MAX_EMAIL_LENGTH &&
  !CONTROL_CHARS.test(email) &&
  !ADDRESS_SPECIALS.test(email) &&
  !MESSAGE_CONTROL_CHARS.test(message);

/** Sends a visitor's message to Mason. Never logs the visitor's details. */
export const sendContactMessage = async (
  input: unknown,
  { apiKey, createMailer, logError }: Deps,
): Promise<ContactSendResult> => {
  const values = parseContactValues(input);
  if (!values || hasErrors(validateContact(values)) || !isSafeToEmail(values)) return { ok: false };

  if (!apiKey) {
    logError("Contact email not sent: RESEND_API_KEY is not set");
    return { ok: false };
  }

  const { subject, text, html } = buildContactEmail(values);
  try {
    const { error } = await createMailer(apiKey).emails.send({
      from: FROM,
      to: contactInfo.email,
      replyTo: values.email.trim(),
      subject,
      text,
      html,
    });
    if (error) {
      // Resend's error message can echo addresses, so log only its code and status
      logError("Contact email rejected by Resend", { name: error.name, statusCode: error.statusCode });
      return { ok: false };
    }
    return { ok: true };
  } catch (thrown) {
    logError("Contact email request failed", {
      name: thrown instanceof Error ? thrown.name : typeof thrown,
    });
    return { ok: false };
  }
};
