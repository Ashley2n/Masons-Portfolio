import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  /** The one main action in a view: solid brand fill, white-ish text (5.11:1 on brand-600) */
  primary:
    "border border-brand-600 bg-brand-600 text-neutral-100 shadow-lg shadow-brand-600/30 transition-[background-color,border-color,box-shadow,transform] hover:border-brand-700 hover:bg-brand-700 hover:shadow-brand-600/40 motion-safe:hover:-translate-y-px",
  /** Dark fill with a brand border (hero, media hero) */
  outline: "border border-brand-600 bg-neutral-950 text-neutral-100 hover:bg-brand-600/15",
  /** Light fill (CTA banner on purple) */
  light: "bg-neutral-100 text-neutral-900 hover:bg-brand-200",
};

export type ButtonVariant = keyof typeof variants;

const icons = { arrow: ArrowUpRight, download: Download };

/** Button look without the element, for controls that must render their own <button> (e.g. ResumeDialog) */
export const buttonClasses = (variant: ButtonVariant = "outline", className?: string) =>
  cn(
    "caption-text group inline-flex w-fit items-center gap-6 rounded-md px-6 py-4 transition-colors duration-300 sm:px-8",
    variants[variant],
    className,
  );

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: keyof typeof icons;
  className?: string;
} & (
  | {
      href: string;
      /** Downloads the file instead of opening it; the value is the saved file name */
      download?: string;
      newTab?: boolean;
      onClick?: never;
    }
  | { href?: undefined; download?: never; newTab?: never; onClick?: () => void }
);

export default function Button({
  children,
  variant = "outline",
  icon,
  className,
  href,
  download,
  newTab,
  onClick,
}: ButtonProps) {
  // The ↗ means "leaves this page", so only new-tab links get it; links within the site have no icon (D-39)
  const iconName = icon ?? (newTab ? "arrow" : undefined);
  const Icon = iconName && icons[iconName];
  const classes = buttonClasses(variant, className);
  const content = (
    <>
      {children}
      {Icon && (
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-300",
            iconName === "arrow" &&
              "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5",
          )}
          strokeWidth={1.75}
        />
      )}
    </>
  );

  if (href && (download || newTab)) {
    // Files and new tabs are plain links: client-side routing doesn't apply to them
    return (
      <a
        href={href}
        download={download}
        {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
        className={classes}
      >
        {content}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
