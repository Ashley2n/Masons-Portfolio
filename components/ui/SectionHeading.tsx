import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const tones = {
  /** On light (neutral-100) sections */
  light: { title: "text-neutral-800", description: "text-neutral-600" },
  /** On the dark page background */
  dark: { title: "text-neutral-100", description: "text-neutral-400" },
};

type SectionHeadingProps = {
  title: string;
  description?: string;
  /** Use "h1" for the main heading of a page */
  as?: "h1" | "h2";
  tone?: keyof typeof tones;
  className?: string;
};

export default function SectionHeading({
  title,
  description,
  as: Heading = "h2",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const headingClass = cn("text-balance text-4xl md:text-h1", tones[tone].title);
  return (
    <div className={cn("space-y-4", className)}>
      {/* Section headings rise into view once; a page title (h1) has the load entrance instead (D-44) */}
      {Heading === "h2" ? (
        <Reveal as="h2" className={headingClass}>
          {title}
        </Reveal>
      ) : (
        <h1 className={headingClass}>{title}</h1>
      )}
      {description && (
        <p className={cn("max-w-md text-body", tones[tone].description)}>{description}</p>
      )}
    </div>
  );
}
