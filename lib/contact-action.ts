"use server";
import { Resend } from "resend";
import type { ContactSendResult } from "@/lib/contact";
import { sendContactMessage } from "@/lib/send-contact-message";

/**
 * Server action behind the contact form. The only place the API key is read; the
 * logic lives in sendContactMessage so it can be tested without sending email.
 */
export async function sendContact(values: unknown): Promise<ContactSendResult> {
  return sendContactMessage(values, {
    apiKey: process.env.RESEND_API_KEY,
    createMailer: (apiKey) => new Resend(apiKey),
    logError: (message, detail) => console.error(message, detail ?? ""),
  });
}
