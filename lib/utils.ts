import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only knows Tailwind's built-in sizes. Without this, our type-scale
// tokens (app/globals.css) look like text colors, and `text-small text-neutral-800`
// would silently drop `text-small`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "display", "h1", "h2", "h3", "body", "small", "caption"] }],
    },
  },
});

/** Combine class names conditionally and resolve Tailwind conflicts (last wins). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
