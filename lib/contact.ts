import { contactContent } from "@/content/contact";

export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const { errors, subjectPrefix } = contactContent.form;
const MIN_MESSAGE_LENGTH = 10;
// Deliberately simple: something@something.tld, no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContact = ({ name, email, message }: ContactValues): ContactErrors => {
  const result: ContactErrors = {};
  if (!name.trim()) result.name = errors.nameRequired;

  if (!email.trim()) result.email = errors.emailRequired;
  else if (!EMAIL_PATTERN.test(email.trim())) result.email = errors.emailInvalid;

  if (!message.trim()) result.message = errors.messageRequired;
  else if (message.trim().length < MIN_MESSAGE_LENGTH) result.message = errors.messageTooShort;

  return result;
};

export const hasErrors = (result: ContactErrors) => Object.keys(result).length > 0;

/** mailto: link with the message ready to send. encodeURIComponent keeps spaces as %20. */
export const buildMailtoUrl = ({ name, email, message }: ContactValues, to: string) => {
  const subject = `${subjectPrefix} ${name.trim()}`;
  const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
