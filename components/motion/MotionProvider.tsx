"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * The one place Motion's features load (D-44). Everything animated uses the small `m` component, never the
 * full `motion` one: `strict` makes a stray `motion.*` throw instead of silently adding about 43 kB (the full component cannot shrink below that).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
