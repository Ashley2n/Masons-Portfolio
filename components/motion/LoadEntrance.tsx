"use client";

import { useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { EASE } from "./tokens";

/** D-44: every item rises and fades in over 1.8s, 0.3s after the one before it, so five items take 3s. */
const ITEM_SECONDS = 1.8;
const STEP_SECONDS = 0.3;

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STEP_SECONDS } },
};

// Items wait at half opacity, not 0: text that starts invisible is not painted for the browser's Largest
// Contentful Paint until the animation ends. Lighthouse 13.6.0 (production build, mobile, 2026-11-08): Home 84
// with opacity 0, 100 with 0.5 (D-44). 0.5 was proposed in the #36 audit and approved by Ashley (2026-11-08); not tuned against other values.
const START_OPACITY = 0.5;

const item: Variants = {
  hidden: { opacity: START_OPACITY, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: ITEM_SECONDS, ease: EASE } },
};

/**
 * Wraps the top block of a page. Its `LoadItem` descendants arrive one after another in document order.
 * `data-motion` is the hook for the CSS in `globals.css` that shows everything for reduced motion, print
 * and no-JS, even while the server-rendered inline styles say "hidden".
 */
export function LoadEntrance({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      data-motion=""
      className={className}
      variants={group}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {children}
    </m.div>
  );
}

export function LoadItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div data-motion="" className={className} variants={item}>
      {children}
    </m.div>
  );
}
