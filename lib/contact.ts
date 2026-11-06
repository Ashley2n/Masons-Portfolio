import { contactContent } from "@/content/contact";
import { siteConfig } from "@/content/site";

export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;
/** Whether a message went out. */
export type ContactSendResult = { ok: boolean };
/**
 * What the form submits: the visitor's values plus the two spam-check fields.
 * `website` is the hidden honeypot (always "" from a real visitor); `startedAt` is when the form loaded, in ms.
 */
export type ContactSubmission = ContactValues & { website: string; startedAt: number };
/** Sends already-validated values; the form waits for the result before confirming. */
export type ContactSend = (submission: ContactSubmission) => Promise<ContactSendResult>;

const { errors, subjectPrefix } = contactContent.form;
const MIN_MESSAGE_LENGTH = 10;
// Keeps contact emails short enough to read at a glance; the error copy promises this limit
export const MAX_MESSAGE_LENGTH = 1500;
// Deliberately simple: something@something.tld, no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContact = ({ name, email, message }: ContactValues): ContactErrors => {
  const result: ContactErrors = {};
  if (!name.trim()) result.name = errors.nameRequired;

  if (!email.trim()) result.email = errors.emailRequired;
  else if (!EMAIL_PATTERN.test(email.trim())) result.email = errors.emailInvalid;

  if (!message.trim()) result.message = errors.messageRequired;
  else if (message.trim().length < MIN_MESSAGE_LENGTH) result.message = errors.messageTooShort;
  else if (message.trim().length > MAX_MESSAGE_LENGTH) result.message = errors.messageTooLong;

  return result;
};

export const hasErrors = (result: ContactErrors) => Object.keys(result).length > 0;

// A mailto: address keeps "@" readable; everything else that could add a header is encoded
const mailto = (address: string, subject?: string) =>
  `mailto:${encodeURIComponent(address).replace(/%40/g, "@")}` +
  (subject ? `?subject=${encodeURIComponent(subject)}` : "");

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
// Visitor input is untrusted: it must show as text in Mason's inbox, never as markup
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

// Email clients can't read CSS variables, so these repeat the design tokens as hex
// (the generated-images exception in docs/architecture.md). lib/contact.test.ts fails if
// a brand value drifts from app/globals.css.
const EMAIL_COLORS = {
  page: "#F5F5F5", // neutral-100
  card: "#FFFFFF", // white
  border: "#E5E5E5", // neutral-200
  heading: "#262626", // neutral-800
  body: "#404040", // neutral-700
  muted: "#737373", // neutral-500
  brand: "#8A2CF6", // brand-600
  link: "#7234E5", // brand-700
  onBrand: "#FFFFFF", // white
};

// Table layout with inline styles: Gmail drops <style> blocks and ignores flex and grid.
const renderEmailHtml = ({
  name: rawName,
  email: rawEmail,
  message: rawMessage,
  subject,
}: ContactValues & { subject: string }) => {
  const name = escapeHtml(rawName);
  const email = escapeHtml(rawEmail);
  // <br> rather than CSS white-space, which some email clients ignore
  const message = escapeHtml(rawMessage).replace(/\r\n?|\n/g, "<br>");
  const { heading, labels, replyPrefix, replySubjectPrefix, footer } = contactContent.form.email;
  const colors = EMAIL_COLORS;
  const row = (label: string, value: string) => `
          <tr><td style="padding:0 32px 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${colors.muted};">${label}</td></tr>
          <tr><td style="padding:0 32px 20px;font-size:16px;line-height:1.6;color:${colors.body};">${value}</td></tr>`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background-color:${colors.page};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${colors.page}" style="background-color:${colors.page};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${colors.card}" style="max-width:600px;background-color:${colors.card};border-top:4px solid ${colors.brand};font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="padding:28px 32px 8px;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${colors.brand};">${siteConfig.name}</td></tr>
        <tr><td style="padding:0 32px 24px;font-size:22px;font-weight:bold;color:${colors.heading};">${heading}</td></tr>${row(labels.name, name)}${row(labels.email, `<a href="${escapeHtml(mailto(rawEmail))}" style="color:${colors.link};">${email}</a>`)}${row(labels.message, message)}
        <tr><td style="padding:8px 32px 32px;">
          <a href="${escapeHtml(mailto(rawEmail, `${replySubjectPrefix} ${subject}`))}" style="display:inline-block;padding:12px 24px;border-radius:6px;background-color:${colors.brand};color:${colors.onBrand};font-size:16px;font-weight:bold;text-decoration:none;">${replyPrefix} ${name}</a>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid ${colors.border};font-size:12px;color:${colors.muted};">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

/** Subject, plain-text and HTML bodies of the email Mason receives. */
export const buildContactEmail = (values: ContactValues) => {
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  const subject = `${subjectPrefix} ${name}`;
  return {
    subject,
    text: `${message}\n\n— ${name}\n${email}`,
    html: renderEmailHtml({ name, email, message, subject }),
  };
};
