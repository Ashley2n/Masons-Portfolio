import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centered content column with the page gutters (16px / 24px / 92px). */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-23", className)}>
      {children}
    </div>
  );
}
