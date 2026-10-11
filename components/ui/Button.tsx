import { ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  /** Dark fill with a brand border (hero, media hero) */
  outline: "border border-brand-600 bg-neutral-950 text-neutral-100 hover:bg-brand-600/15",
  /** Light fill (CTA banner on purple) */
  light: "bg-neutral-100 text-neutral-900 hover:bg-white",
};

const icons = { arrow: ArrowUpRight, download: Download };

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
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
  icon = "arrow",
  className,
  href,
  download,
  newTab,
  onClick,
}: ButtonProps) {
  const Icon = icons[icon];
  const classes = cn(
    "caption-text inline-flex w-fit items-center gap-6 rounded-md px-8 py-4 transition-colors duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
    variants[variant],
    className,
  );
  const content = (
    <>
      {children}
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
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
