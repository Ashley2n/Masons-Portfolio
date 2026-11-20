import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { pressClasses } from "@/lib/press";
import { cn } from "@/lib/utils";

/**
 * D-50: a light layer (`::before`) sits between the button's own fill and its text, so the surface reads as
 * lit from above. `isolate` keeps that layer inside the button; its opacity is what changes on hover.
 */
const litLayer =
  "isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-linear-to-b before:transition-opacity";

const variants = {
  /** The one main action in a view: solid brand fill, white-ish text (5.11:1 on brand-600 at rest) */
  primary: cn(
    litLayer,
    "border border-neutral-100/20 bg-brand-600 text-neutral-100 shadow-btn-primary before:from-neutral-100/14 before:via-neutral-100/[0.03] before:to-transparent before:opacity-80",
    "hover:border-neutral-100/30 hover:shadow-btn-primary-hover hover:before:opacity-100 motion-safe:hover:-translate-y-px",
    "active:shadow-btn-pressed",
  ),
  /** The quieter sibling (the "secondary"): a soft purple tint with pale purple text that deepens on hover (D-50) */
  outline: cn(
    "border border-brand-500/35 bg-tonal text-brand-200 shadow-btn-tonal",
    "hover:border-brand-500/60 hover:bg-tonal-hover hover:shadow-btn-tonal-hover",
    "active:shadow-btn-pressed",
  ),
  /** Light fill (CTA banner on purple) */
  light: "bg-neutral-100 text-neutral-900 hover:bg-brand-200",
};

export type ButtonVariant = keyof typeof variants;

const icons = { arrow: ArrowUpRight, download: Download };

/** Button look without the element, for controls that must render their own <button> (e.g. ResumeDialog) */
export const buttonClasses = (variant: ButtonVariant = "outline", className?: string) =>
  cn(
    "button-text group relative inline-flex w-fit items-center gap-6 rounded-md px-6 py-4 transition-colors sm:px-8",
    variants[variant],
    pressClasses,
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
