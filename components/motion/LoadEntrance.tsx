"use client";

import { useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

/** D-44: every item rises and fades in over 1.8s, 0.3s after the one before it, so five items take 3s. */
const ITEM_SECONDS = 1.8;
const STEP_SECONDS = 0.3;
const EASE = [0.16, 1, 0.3, 1] as const; // the site's easing (D-41)

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STEP_SECONDS } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
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
