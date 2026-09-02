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

/**
 * The subject of the headline. One miss keeps the day's own name
 * ("Yesterday"); a multi-day miss has to say so, because the week strip is
 * drawing every one of those dashed circles right underneath. A week or more
 * stops counting and says "A week" — past that the number is only a scold.
 */
function missSubject(dayLabel: string, missedDays: number): string {
  if (missedDays >= 7) return 'A week';
  if (missedDays >= 2) return `${spellCount(missedDays)} days`;
  return dayLabel;
}

/** "Yesterday got away. Eight days didn't." / "Two days got away. …" */
export function recoveryHeadlineCopy(
  dayLabel: string,
  brokenRun: number,
  missedDays = 1
): string {
  const subject = missSubject(dayLabel, missedDays);
  if (brokenRun <= 0) return `${subject} got away. Today doesn’t have to.`;
  if (brokenRun === 1) return `${subject} got away. One day didn’t.`;
  return `${subject} got away. ${spellCount(brokenRun)} days didn’t.`;
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
  // Floor: "Your 2-day record still stands" is not reassurance, it is a
  // reminder of how little there is. Below three days there is no record worth
  // naming, so the card points forward instead.
  if (bestStreak < 3) return 'Today starts the next one.';
  if (brokenRun > 0 && brokenRun >= bestStreak) {
    return `That ${brokenRun}-day run is still your record.`;
  }
  if (bestStreak > 0) {
    return `Your ${bestStreak}-day record still stands.`;
  }
  return 'Today starts the next one.';
}
