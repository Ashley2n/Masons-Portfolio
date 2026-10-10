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
        "relative isolate min-h-screen overflow-hidden bg-white",
        className,
      )}
    >
      {/* Background layer: the glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -bottom-40 -right-40 h-164 w-166 rounded-full bg-brand-500 opacity-70 blur-[120px]" />
      </div>

      {/* Foreground: anything you put here is unaffected by the glow */}
      {children}
    </section>
  );
}
