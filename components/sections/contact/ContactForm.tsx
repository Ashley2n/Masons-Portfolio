"use client";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { contactContent } from "@/content/contact";
import { contactInfo } from "@/content/site";
import {
  hasErrors,
  validateContact,
  type ContactErrors,
  type ContactSend,
  type ContactValues,
} from "@/lib/contact";
import { sendContact } from "@/lib/contact-action";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  /** Sends the validated values. Injectable so tests don't navigate or hit the network. */
  send?: ContactSend;
};

type ContactStatus = "idle" | "sending" | "sent" | "failed";

const fields = ["name", "email", "message"] as const;
const inputClass =
  "w-full rounded-md border bg-neutral-950/60 px-4 py-3 text-neutral-100 placeholder:text-neutral-400 transition-colors focus-visible:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-500/40";

// Defaults to the Resend server action (D-19); tests inject a fake instead
export default function ContactForm({ send = sendContact }: ContactFormProps) {
  const { form } = contactContent;
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const honeypot = useRef<HTMLInputElement>(null);
  // When the form loaded, so the server can reject a submission that came too fast to be a person
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = (field: keyof ContactValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // An edit means the confirmation no longer describes what's in the form
    setStatus("idle");
    // After the first submit, re-check as the visitor types so fixed fields clear
    if (submitted) setErrors(validateContact(next));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // aria-disabled keeps the button focusable, so the double-submit guard lives here
    if (status === "sending") return;
    setSubmitted(true);
    const result = validateContact(values);
    setErrors(result);
    if (hasErrors(result)) {
      const firstInvalid = fields.find((field) => result[field]);
      if (firstInvalid) refs[firstInvalid].current?.focus();
      return;
    }
    setStatus("sending");
    // A network drop rejects instead of resolving { ok: false }; both mean "not sent"
    const ok = await send({ ...values, website: honeypot.current?.value ?? "", startedAt: startedAt.current }).then(
      (result) => result.ok,
      () => false,
    );
    setStatus(ok ? "sent" : "failed");
  };

  const fieldProps = (field: (typeof fields)[number]) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    placeholder: form.placeholders[field],
    "aria-required": true,
    // Read-only, not disabled: stays focusable and readable, but the text can't drift from what's being sent
    readOnly: status === "sending",
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: cn(inputClass, errors[field] ? "border-red-400" : "border-neutral-700"),
  });

  const label = (field: (typeof fields)[number]) => (
    <label htmlFor={`contact-${field}`} className="caption-text block text-neutral-300">
      {form.labels[field]}
    </label>
  );

  const error = (field: (typeof fields)[number]) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="text-small text-red-300">
        {errors[field]}
      </p>
    );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          {label("name")}
          <input ref={refs.name} type="text" autoComplete="name" {...fieldProps("name")} onChange={(e) => update("name", e.target.value)} />
          {error("name")}
        </div>
        <div className="space-y-2">
          {label("email")}
          <input ref={refs.email} type="email" autoComplete="email" {...fieldProps("email")} onChange={(e) => update("email", e.target.value)} />
          {error("email")}
        </div>
      </div>
      <div className="space-y-2">
        {label("message")}
        <textarea ref={refs.message} rows={6} {...fieldProps("message")} onChange={(e) => update("message", e.target.value)} />
        {error("message")}
      </div>

      {/* Honeypot: real visitors never see or reach it, bots that fill every field do. sr-only keeps it rendered, since some bots skip display:none fields. */}
      <div aria-hidden="true" className="sr-only">
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        aria-disabled={status === "sending" || undefined}
        className={buttonClasses(
          "primary",
          "w-full justify-between py-5 aria-disabled:cursor-wait aria-disabled:opacity-70",
        )}
      >
        {status === "sending" ? form.sending : form.submit}
        {status === "sending" ? (
          // Decorative: the "Sending…" text is the announcement. Still for reduced motion.
          <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
        ) : (
          <ArrowRight aria-hidden="true" className="size-5" />
        )}
      </button>

      <p role="status" className="flex items-center gap-4 text-small text-neutral-400">
        <span aria-hidden="true" className="h-px w-8 bg-brand-500" />
        {status === "sent" && form.sent}
        {status === "failed" && (
          <span>
            {form.failed}{" "}
            <a href={`mailto:${contactInfo.email}`} className="text-brand-500 underline">
              {contactInfo.email}
            </a>
            .
          </span>
        )}
        {status === "sending" && form.sending}
        {status === "idle" && form.note}
      </p>
    </form>
  );
}
