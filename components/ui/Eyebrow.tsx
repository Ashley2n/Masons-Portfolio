import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase label shown above headings ("caption" style). */
export default function Eyebrow({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <p id={id} className={cn("caption-text text-brand-600", className)}>
      {children}
    </p>
  );
}
