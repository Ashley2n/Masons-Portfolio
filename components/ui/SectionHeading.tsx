import { cn } from "@/lib/utils";
import Eyebrow from "./Eyebrow";

const tones = {
  /** On light (neutral-100) sections */
  light: { title: "text-neutral-800", description: "text-neutral-600" },
  /** On the dark page background */
  dark: { title: "text-neutral-100", description: "text-neutral-400" },
};

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Use "h1" for the main heading of a page */
  as?: "h1" | "h2";
  tone?: keyof typeof tones;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <Heading className={tones[tone].title}>{title}</Heading>
      {description && (
        <p className={cn("max-w-sm text-small", tones[tone].description)}>{description}</p>
      )}
    </div>
  );
}
