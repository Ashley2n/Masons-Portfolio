import type { Milestone, Photo } from "@/types/content";

// Copy from the About mockup. Photos are free Unsplash images (D-11).
export const aboutContent = {
  eyebrow: "About Me",
  title: "About Me",
  paragraphs: [
    "I'm a multidisciplinary artist creating meaningful experiences through performance and design.",
    "Years of training, stages, and performances shaped where I am today. I bring creativity, discipline, and purpose to every project I take on.",
  ],
  // Placeholder until Mason sends his real signature (Q C13)
  signature: "Mason F.",
  feature: {
    title: "Designer",
    description: "Branding & Digital Design",
    href: "/media",
    image: {
      src: "/images/about/feature-peaks.jpg",
      alt: "Snow-covered mountain peaks under a violet sky",
      credit: "Kai Oberhäuser / Unsplash",
    } satisfies Photo,
  },
  journey: { eyebrow: "My Story", title: "My Journey" },
};

export const milestones: Milestone[] = [
  {
    id: "found-the-stage",
    title: "Found the Stage",
    description:
      "Started performing formally, taking on Bass I in choir and joining Show Choir — the beginning of a performance foundation that would carry through high school.",
    status: "complete",
    image: {
      src: "/images/about/journey-choir.jpg",
      alt: "A crowd lit in deep red light during a performance",
      credit: "Joshua Hanson / Unsplash",
    },
  },
  {
    id: "first-role",
    title: "First Role, First Spark",
    description:
      "Stepped into my first musical production and Dance Captain role in the same year — the moment that revealed what real teamwork, passion, and hard work could look like, and pulled me toward a life on stage.",
    status: "complete",
    image: {
      src: "/images/about/journey-first-role.jpg",
      alt: "Performers silhouetted against a red stage curtain",
      credit: "Kyle Head / Unsplash",
    },
  },
  {
    id: "went-all-in",
    title: "Went All In",
    description:
      "Made the decision to fully commit to performing, stepping up from performer to director and planner across multiple productions and events — proof of the leap paying off almost immediately.",
    status: "complete",
    image: {
      src: "/images/about/journey-rehearsal.jpg",
      alt: "A cast rehearsing on a bare stage under work lights",
      credit: "Hamish Kale / Unsplash",
    },
  },
  {
    id: "american-gothic",
    title: "Joined American Gothic Performing Arts",
    description:
      "Brought on with a performing arts company outside Central College, taking on multiple named roles across simultaneous productions — the clearest sign yet that the “all in” bet is working.",
    status: "complete",
    image: {
      src: "/images/about/journey-gothic.jpg",
      alt: "Gothic towers lit purple against the night sky",
      credit: "Ethan / Unsplash",
    },
  },
  {
    id: "americas-got-talent",
    title: "America's Got Talent",
    description: "Pursued opportunities on larger stages, learning, growing, and gaining exposure.",
    status: "ongoing",
  },
  {
    id: "movie-actor",
    title: "Movie Actor",
    description: "Expanding into film and television, bringing stories to life on screen.",
    status: "ongoing",
  },
];
