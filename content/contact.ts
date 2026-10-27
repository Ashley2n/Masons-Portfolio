import type { Photo } from "@/types/content";

// Copy from the Contact mockup. The form opens the visitor's email app (mailto) until
// Mason chooses a delivery service (D-07, Q C2).
export const contactContent = {
  eyebrow: "Get in touch",
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
    note: "I'll get back to you as soon as possible.",
    sent: "Your email app should open with the message ready to send. If it didn't, email me directly at",
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
  },
  card: {
    eyebrow: "Contact info",
    followTitle: "Follow",
    quote: "Good art starts with a conversation.",
    image: {
      src: "/images/contact/coast-violet-rocks.jpg",
      alt: "Dark rocks in misty, long-exposure sea water under a violet dusk sky",
      credit: "Wang / Wikimedia Commons (CC0)",
    } satisfies Photo,
  },
};
