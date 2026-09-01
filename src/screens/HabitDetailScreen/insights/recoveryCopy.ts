/**
 * Recovery copy — the amber variant of the hero.
 *
 * The prototype's line is "Yesterday got away. {N} days didn't." where N is the
 * run the miss actually broke, spelled out. That number is derived here from the
 * same runs the History rail draws, so the sentence can never claim a streak the
 * log does not contain.
 *
 * The prototype also says "Strength dipped 3 points" and ends on "never miss
 * twice". The delta is invented — `convex/habitStrength/momentum.ts` decays
 * proportionally — and the dial now sits on the page in recovery, so the body
 * says neither. It names the record that still stands and stops.
 */

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
] as const;

/** "Three" up to twelve, digits above — the prototype's rule. */
export function spellCount(value: number): string {
  return NUMBER_WORDS[value] ?? String(value);
}

/** "Yesterday got away. Eight days didn't." */
export function recoveryHeadlineCopy(
  dayLabel: string,
  brokenRun: number
): string {
  if (brokenRun <= 0) return `${dayLabel} got away. Today doesn’t have to.`;
  if (brokenRun === 1) return `${dayLabel} got away. One day didn’t.`;
  return `${dayLabel} got away. ${spellCount(brokenRun)} days didn’t.`;
}

/**
 * One sentence about what the miss did not take. The action ("two minutes")
 * lives in the fixed slot under the toggle, so the body does not repeat it,
 * and it states no rule: the job of this card is one tap, not a policy.
 */
export function recoveryBodyCopy(
  brokenRun: number,
  bestStreak: number
): string {
  if (brokenRun > 0 && brokenRun >= bestStreak) {
    return `That ${brokenRun}-day run is still your record.`;
  }
  if (bestStreak > 0) {
    return `Your ${bestStreak}-day record still stands.`;
  }
  return 'Today starts the next one.';
}
