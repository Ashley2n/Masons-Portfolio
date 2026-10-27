"use client";
import { ArrowRight } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { contactContent } from "@/content/contact";
import { contactInfo } from "@/content/site";
import {
  buildMailtoUrl,
  hasErrors,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  /** Opens the mailto: link. Injectable so tests don't navigate. */
  send?: (url: string) => void;
};

const fields = ["name", "email", "message"] as const;
const inputClass =
  "w-full rounded-md border bg-neutral-950/60 px-4 py-3 text-neutral-100 placeholder:text-neutral-400 transition-colors focus-visible:border-brand-500 focus-visible:outline-2 focus-visible:outline-brand-500/40";

// Opens the mail app by clicking a temporary link. Unlike assigning window.location,
// this is a normal link activation that browsers (and the e2e test) can observe.
const openMailApp = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
};

export default function ContactForm({ send = openMailApp }: ContactFormProps) {
  const { form } = contactContent;
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const update = (field: keyof ContactValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // An edit means the confirmation no longer describes what's in the form
    setSent(false);
    // After the first submit, re-check as the visitor types so fixed fields clear
    if (submitted) setErrors(validateContact(next));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const result = validateContact(values);
    setErrors(result);
    if (hasErrors(result)) {
      const firstInvalid = fields.find((field) => result[field]);
      if (firstInvalid) refs[firstInvalid].current?.focus();
      return;
    }
    send(buildMailtoUrl(values, contactInfo.email));
    setSent(true);
  };

  const fieldProps = (field: (typeof fields)[number]) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    placeholder: form.placeholders[field],
    "aria-required": true,
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

      <button
        type="submit"
        className="caption-text flex w-full items-center justify-between rounded-md border border-brand-700 bg-linear-to-r from-brand-800 to-neutral-950 px-8 py-5 text-neutral-100 transition-colors hover:from-brand-700"
      >
        {form.submit}
        <ArrowRight aria-hidden="true" className="size-5" />
      </button>

      <p role="status" className="flex items-center gap-4 text-small text-neutral-400">
        <span aria-hidden="true" className="h-px w-8 bg-brand-500" />
        {sent ? (
          <span>
            {form.sent}{" "}
            <a href={`mailto:${contactInfo.email}`} className="text-brand-500 underline">
              {contactInfo.email}
            </a>
            .
          </span>
        ) : (
          form.note
        )}
      </p>
    </form>
  );
}
