"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useState, type ReactNode } from "react";
import { EASE, IN_VIEW_AMOUNT, staggerDelay } from "./tokens";

/** D-44: a block rises and fades in once, the first time about a fifth of it is in view. */
const RISE_PX = 40;
const REVEAL_SECONDS = 0.8;

// The tag is chosen by the caller because an <li> or an <h2> cannot sit inside a wrapper <div>
const tags = { div: m.div, li: m.li, h2: m.h2 } as const;

type RevealProps = {
  as?: keyof typeof tags;
  /** Position in a group that arrives together (grid items): later ones start a little later */
  index?: number;
  id?: string;
  className?: string;
  /**
   * Mount already at rest, with no hidden start state. For blocks that appear while the visitor is looking (the
   * gallery after a tab change or "Load more"): a hidden start would make photos already in view blink out (#33).
   */
  instant?: boolean;
  children: ReactNode;
};

/**
 * Scroll reveal that plays once. `data-motion` is the hook for the CSS in `globals.css` that shows everything
 * for reduced motion and print, and the `<noscript>` rule in `app/layout.tsx` does the same without JavaScript
 * (Motion server-renders the hidden start state inline).
 */
export function Reveal({ as = "div", index = 0, id, className, instant = false, children }: RevealProps) {
  // Focus inside the block rests it at once, the same way reduced motion does: animation must never hide the
  // control a keyboard user is on (#29 story 32, D-44). `onFocus` bubbles in React, so any control inside counts.
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion() || instant || focused;
  const Tag = tags[as];
  // The server cannot know the visitor's setting, so it always sends the hidden start state. Motion's
  // `useReducedMotion` reads the real setting on the first client render, so with reduced motion the block starts at
  // rest and goes to its resting state at once, instead of waiting for a scroll and then animating underneath the
  // CSS that already shows it. That makes its inline style differ from the server's on purpose, so React is told
  // not to warn about it (it would, in development only; the CSS rule for `[data-motion]` shows the block meanwhile).
  return (
    <Tag
      data-motion=""
      suppressHydrationWarning
      onFocus={() => setFocused(true)}
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y: RISE_PX }}
      animate={reduce ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: IN_VIEW_AMOUNT }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: REVEAL_SECONDS, ease: EASE, delay: staggerDelay(index) }
      }
    >
      {children}
    </Tag>
  );
}
