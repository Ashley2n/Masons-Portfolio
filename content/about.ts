import type { Milestone, Photo } from "@/types/content";

// Copy from the About mockup. The Designer card is still a free Unsplash image (D-11); the timeline photos are Mason's own (#38).
export const aboutContent = {
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
  journey: { title: "My Journey" },
};

export const milestones: Milestone[] = [
  {
    id: "found-the-stage",
    title: "Found the Stage",
    description:
      "Started performing formally, taking on Bass I in choir and joining Show Choir — the beginning of a performance foundation that would carry through high school.",
    status: "complete",
    image: {
      src: "/images/about/found-the-stage.jpg",
      alt: "A show choir in leopard-print costumes dancing on risers in front of a red stage curtain",
    },
  },
  {
    id: "first-role",
    title: "First Role, First Spark",
    description:
      "Stepped into my first musical production and was chosen as Dance Captain for the Show Choir my senior year of high school — the moment that revealed what real teamwork, passion, and hard work could look like, and pulled me toward a life on stage.",
    status: "complete",
    image: {
      src: "/images/about/first-role.jpg",
      alt: "A performer in a white chef's jacket sitting on a sofa in a pool of stage light",
    },
  },
  {
    id: "went-all-in",
    title: "Went All In",
    description:
      'After exploring "safer" career options, I soon found out that my passion truly lay in performance. So I declared a major in Musical Theatre and immediately explored aspects of the field, including performing, designing, and directing.',
    status: "complete",
    image: {
      src: "/images/about/went-all-in.jpg",
      alt: "Four photos: a performer in a patterned vest on stage, a painted set design on a desk, a group of cast members in white costumes, and a performer in a suit and sunglasses holding a cane",
    },
  },
  {
    id: "american-gothic",
    title: "First Regional Contract",
    // *Stars* mark show titles; Timeline turns them into <em> (lib/emphasis.ts)
    description:
      "I had the opportunity to join American Gothic Performing Arts as Diesel in *West Side Story* and Ensemble in *Grease* for an exciting first professional theatre experience.",
    status: "complete",
    image: {
      src: "/images/about/first-regional-contract.jpg",
      alt: "A cast in 1960s-style costumes dancing on a lit stage, with a singer at a microphone in the centre",
    },
  },
  {
    id: "broadway",
    title: "Broadway",
    description:
      "Working towards reaching the pinnacle of theatre, one step, one lesson, audition, role, and performance at a time.",
    status: "ongoing",
  },
  {
    id: "movie-actor",
    title: "Movie Actor",
    description:
      "Expanding into film and television and bringing stories to life on screen is a goal for later in my career that I am working towards currently.",
    status: "ongoing",
  },
];
