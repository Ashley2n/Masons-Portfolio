/** Index of the next slide, wrapping from the last slide back to the first. */
export const getNextIndex = (currentIndex: number, length: number) =>
  length === 0 ? 0 : (currentIndex + 1) % length;
