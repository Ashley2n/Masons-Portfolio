export type EmphasisSegment = { text: string; em: boolean };

// Copy in content/ marks italics as *like this* (show titles). Only a matched pair of single stars counts; there is
// no escaping, because the copy is ours and has no other use for a star.
export function parseEmphasis(text: string): EmphasisSegment[] {
  // split() with one capture group alternates plain text (even index) and the captured emphasis (odd index)
  return text
    .split(/\*([^*]+)\*/)
    .map((part, i) => ({ text: part, em: i % 2 === 1 }))
    .filter((segment) => segment.text !== "");
}
