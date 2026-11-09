"use client";

import { animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";

/** D-44: a number counts from 0 to the real number once, when about a fifth of it is in view. */
const SECONDS = 1.8; // one load-entrance item
const EASE = [0.16, 1, 0.3, 1] as const; // the site's easing (D-41)
const IN_VIEW_AMOUNT = 0.2; // same rule as `Reveal`
/** Same stagger as the `Reveal` the stat sits in, so the count and the rise move together */
const STAGGER_SECONDS = 0.1;
const MAX_STAGGER_STEPS = 3;

/** Only a plain run of digits counts up. Anything else ("1.5", "1,200", "5k", "") is shown as written. */
export function parseCount(value: string): number | null {
  return /^\d+$/.test(value) ? Number(value) : null;
}

type CountUpProps = {
  /** The real number, as written in `content/` */
  value: string;
  /** Position in the group the `Reveal` staggers (same `index` as that `Reveal`) */
  index?: number;
};

/**
 * The number inside a Journey stat. The real number is always in the DOM as text for screen readers (`sr-only`),
 * and the visible counter is `aria-hidden`, so a screen reader never reads a half-counted number. The server
 * renders the final number, so without JavaScript, in print and for reduced motion nothing has to be undone: the
 * count only starts in the browser, when the number comes into view, and only if motion is not reduced.
 */
export function CountUp({ value, index = 0 }: CountUpProps) {
  const target = parseCount(value);
  const count = useMotionValue(target ?? 0);
  const shown = useTransform(count, (latest) => Math.round(latest));
  const running = useRef<ReturnType<typeof animate>>(undefined);
  useEffect(() => () => running.current?.stop(), []);

  // Runs once, when the number first comes into view (the same viewport rule as `Reveal`, so jsdom copes with it too)
  const start = () => {
    // Read here, not from `useReducedMotion`: that is still false while hydrating, and a stat already in view at
    // load would count for someone who asked for no motion.
    if (target === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    count.set(0);
    running.current = animate(count, target, {
      duration: SECONDS,
      ease: EASE,
      delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER_SECONDS,
    });
  };

  if (target === null) return <>{value}</>;

  return (
    <>
      <span className="sr-only">{value}</span>
      {/* The holder is as wide as the final number, so the "+" beside it never moves, and ends right next to it as
          `10+` always did. (Playfair's digits are not one width, so `tabular-nums` does nothing here and a width in
          `ch` left a gap of up to 25px.) The counter is right-aligned inside it: a half-counted number can be wider
          than the final one ("10" on its way to "12"), and this way it grows into empty space, not onto the "+". */}
      <span aria-hidden="true" className="relative inline-block">
        <span aria-hidden="true" className="invisible">
          {value}
        </span>
        <m.span
          onViewportEnter={start}
          viewport={{ once: true, amount: IN_VIEW_AMOUNT }}
          data-testid="count-up"
          className="absolute top-0 right-0 whitespace-nowrap"
        >
          {shown}
        </m.span>
      </span>
    </>
  );
}
