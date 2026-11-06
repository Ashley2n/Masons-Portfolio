/**
 * Press feedback for any control (D-42): shrinks 3% while held and dims a little, quickly in
 * (100ms), easing back out at the control's own pace. Reduced motion drops the shrink but keeps
 * the dimming, so a press is never silent. Put it last in `cn(...)` so its `transition-[...]`
 * replaces a control's own `transition-colors`; it lists every property those controls animate.
 */
export const pressClasses =
  "transition-[color,background-color,border-color,opacity,box-shadow,translate,scale,filter] active:duration-100 active:brightness-90 motion-safe:active:scale-[0.97]";
