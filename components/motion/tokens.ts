/** Numbers the scroll-driven motion shares (D-44), so `Reveal` and `CountUp` cannot drift apart. */

/** The site's easing (D-41) */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** A block counts as reached when about a fifth of it is in view */
export const IN_VIEW_AMOUNT = 0.2;

/** Grid items that arrive together follow one another 0.1s apart, up to three steps, so a long list never lags. */
const STAGGER_SECONDS = 0.1;
const MAX_STAGGER_STEPS = 3;

/** Delay for the item at `index` in a group that arrives together */
export function staggerDelay(index: number): number {
  return Math.min(index, MAX_STAGGER_STEPS) * STAGGER_SECONDS;
}
