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
  return (
    <div className={cn("space-y-4", className)}>
      <Heading
        className={cn(
          "text-balance text-4xl md:text-h1",
          tones[tone].title,
          // Section headings rise into view; a page title (h1) never does (D-41)
          Heading === "h2" && "reveal",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("max-w-md text-body", tones[tone].description)}>{description}</p>
      )}
    </div>
  );
}
