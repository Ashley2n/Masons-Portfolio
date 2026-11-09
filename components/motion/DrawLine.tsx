"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

/**
 * D-44: the line the timeline hangs from is drawn by scrolling. Its tip stays at this fraction of the screen height
 * while the visitor scrolls through the list, so it reaches a node as that entry comes into the reading zone.
 */
const TIP_AT = 0.6;

/**
 * Wraps the timeline `<ol>` (an `<ol>` may only hold `<li>`, so the line is its sibling, not a child). `children`
 * pass through, so the milestones stay server-rendered. `data-motion` is the hook for the CSS in `globals.css` and
 * the `<noscript>` rule in `app/layout.tsx` that show the whole line for reduced motion, print and no JavaScript
 * (Motion server-renders the clipped start state inline). There is no reduced-motion branch here on purpose: the
 * `!important` CSS rule already wins over the inline clip, and a branch would be code no test can reach.
 */
export function DrawLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${TIP_AT}`, `end ${TIP_AT}`] });
  // Clip from the bottom, so the dashes are revealed from the top down and never stretched
  const clipPath = useTransform(scrollYProgress, (progress) => `inset(0 0 ${(1 - progress) * 100}% 0)`);

  return (
    <div ref={ref} className="relative">
      <m.div
        aria-hidden="true"
        data-testid="timeline-line"
        data-motion=""
        className="absolute inset-y-0 left-4 border-l-2 border-dashed border-neutral-300 md:left-1/2"
        style={{ clipPath }}
      />
      {children}
    </div>
  );
}
