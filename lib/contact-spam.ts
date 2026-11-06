/** Fastest a human could read, fill in and send the form. Bots that submit instantly come in under it. */
export const MIN_FILL_MS = 3000;

type SpamFields = { website: unknown; startedAt: unknown };

/**
 * Basic bot check, run on the server because anyone can call the action directly.
 * `website` is the hidden honeypot: the real form always sends "", so anything else is a bot.
 * `startedAt` is when the form loaded (client clock, so a bot that reads our code can forge it).
 * A missing, non-numeric or future time counts as spam too, same as a too-fast one.
 */
export const isSpamSubmission = ({ website, startedAt }: SpamFields, now: number): boolean => {
  const honeypotFilled = website !== "";
  const loadTimeInvalid = typeof startedAt !== "number" || !Number.isFinite(startedAt);
  return honeypotFilled || loadTimeInvalid || now - startedAt < MIN_FILL_MS;
};
