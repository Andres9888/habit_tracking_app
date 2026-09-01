/**
 * Recovery copy — the amber variant of the hero.
 *
 * The prototype's line is "Yesterday got away. {N} days didn't." where N is the
 * run the miss actually broke, spelled out. That number is derived here from the
 * same runs the History rail draws, so the sentence can never claim a streak the
 * log does not contain.
 *
 * The prototype also says "Strength dipped 3 points". That number is invented —
 * `convex/habitStrength/momentum.ts` decays proportionally (strength × (1 −
 * baseDecay)), so the drop depends on where you were and which mode the habit
 * runs. We keep the true half of the claim (it dips, it never reaches zero) and
 * drop the fake precision.
 */

/** The bolded tail of the recovery body. */
export const NEVER_MISS_TWICE = 'never miss twice.';

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

/** Everything before the bolded `never miss twice.` */
export function recoveryBodyCopy(
  brokenRun: number,
  bestStreak: number
): string {
  const rule = 'The only rule that matters today: ';
  if (brokenRun > 0 && brokenRun >= bestStreak) {
    return `Strength dipped, not to zero, and that ${brokenRun}-day run is still your record. ${rule}`;
  }
  if (bestStreak > 0) {
    return `Strength dipped, not to zero, and your ${bestStreak}-day record still stands. ${rule}`;
  }
  return `Strength dipped, not to zero. ${rule}`;
}
