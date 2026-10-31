import { contactContent } from "@/content/contact";

export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;
/** Whether a message went out. */
export type ContactSendResult = { ok: boolean };
/** Sends already-validated values; the form waits for the result before confirming. */
export type ContactSend = (values: ContactValues) => Promise<ContactSendResult>;

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

/** Subject and plain-text body of the email Mason receives. */
export const buildContactEmail = ({ name, email, message }: ContactValues) => ({
  subject: `${subjectPrefix} ${name.trim()}`,
  text: `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`,
});
