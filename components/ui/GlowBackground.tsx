import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowBackgroundProps = {
  children: ReactNode;
  className?: ComponentPropsWithoutRef<"section">["className"];
};

export default function GlowBackground({ children, className }: GlowBackgroundProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-white",
        className,
      )}
    >
      {/* Background layer: the glow. It sits in the lower right, and the mask fades it
          out before the section's bottom edge so it doesn't stop at a hard line
          where the next section starts. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mask-b-from-75% mask-b-to-100%"
      >
        <div className="absolute -right-40 bottom-16 h-164 w-166 rounded-full bg-brand-500 opacity-70 blur-[120px]" />
      </div>

      {/* Foreground: anything you put here is unaffected by the glow */}
      {children}
    </section>
  );
}
