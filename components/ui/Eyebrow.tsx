import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  /** On light (neutral-100) sections: brand-600 is 5.1:1 */
  light: "text-brand-600",
  /** On the dark page background: brand-600 is only 3.6:1, brand-500 is 7.3:1 */
  dark: "text-brand-500",
  /** Over a photo (the Contact card): brand-500 isn't enough there, brand-200 passes AA (D-28) */
  photo: "text-brand-200",
};

/** Small uppercase label shown above headings ("caption" style). */
export default function Eyebrow({
  children,
  className,
  id,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <p id={id} className={cn("caption-text", tones[tone], className)}>
      {children}
    </p>
  );
}
