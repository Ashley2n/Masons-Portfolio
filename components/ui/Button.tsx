import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  /** Dark fill with a brand border (hero, media hero) */
  outline: "border border-brand-600 bg-neutral-950 text-neutral-100 hover:bg-brand-600/15",
  /** Light fill (CTA banner on purple) */
  light: "bg-neutral-100 text-neutral-900 hover:bg-white",
};

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
} & (
  | { href: string; onClick?: never }
  | { href?: undefined; onClick?: () => void }
);

export default function Button({
  children,
  variant = "outline",
  className,
  href,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "caption-text inline-flex w-fit items-center gap-6 rounded-md px-8 py-4 transition-colors duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
    variants[variant],
    className,
  );
  const content = (
    <>
      {children}
      <span aria-hidden="true" className="font-bold">
        ↗
      </span>
    </>
  );

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
