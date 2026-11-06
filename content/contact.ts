import type { Photo } from "@/types/content";

// Copy from the Contact mockup. The form sends through Resend (D-19); the sending, sent
// and failed wording was agreed with Ashley on 2026-10-31 (the mockup has none).
export const contactContent = {
  title: "Let's create something great.",
  intro:
    "Have a project, opportunity, or idea in mind? Whether it's a performance, creative collaboration, or just a conversation — I'd love to hear from you.",
  form: {
    labels: { name: "Name", email: "Email", message: "Message" },
    placeholders: {
      name: "Your name",
      email: "you@example.com",
      message: "Tell me about your project, opportunity, or idea…",
    },
    submit: "Send message",
    sending: "Sending…",
    note: "I'll get back to you as soon as possible.",
    sent: "Thanks, your message is on its way. I'll get back to you as soon as possible.",
    failed: "Sorry, your message didn't send. Please email me directly at",
    errorSummary: "Please fix the highlighted fields.",
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address, like you@example.com.",
      messageRequired: "Please enter a message.",
      messageTooShort: "Please write at least 10 characters so I know how to help.",
      messageTooLong:
        "Please keep it under 1,500 characters. We can go into more detail once we're in touch.",
    },
    subjectPrefix: "Portfolio inquiry from",
    // Sender name Mason sees in his inbox; the address is Resend's until a domain is verified
    emailFromName: "Portfolio contact form",
    // The branded HTML email Mason receives (D-19, #18); the wording isn't in a mockup
    email: {
      heading: "New message from your portfolio",
      labels: { name: "Name", email: "Email", message: "Message" },
      replyPrefix: "Reply to",
      replySubjectPrefix: "Re:",
      footer: "Sent from the contact form on your portfolio site.",
    },
  },
  card: {
    label: "Contact info",
    followTitle: "Follow",
    quote: "Good art starts with a conversation.",
    image: {
      src: "/images/contact/coast-violet-rocks.jpg",
      alt: "Dark rocks in misty, long-exposure sea water under a violet dusk sky",
      credit: "Wang / Wikimedia Commons (CC0)",
    } satisfies Photo,
  },
};
