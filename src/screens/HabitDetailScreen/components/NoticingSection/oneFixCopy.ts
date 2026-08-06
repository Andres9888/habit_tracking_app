/** Prose for the "One fix to try" card, kept out of the component. */

import type { OneFixInsight } from '../../insights';

/** "Missed 3 of the last 4 — every other day holds." */
export function oneFixBody(insight: OneFixInsight): string {
  const { recentMissed, recentOf, weakest } = insight;
  const rate = Math.round(weakest.rate * 100);
  if (recentOf >= 2 && recentMissed > 0) {
    return `Missed ${recentMissed} of the last ${recentOf} — every other day holds.`;
  }
  return `${weakest.plural} land ${rate}% of the time — every other day holds.`;
}

/**
 * Habit stacking (Fogg, Clear): anchor the weak day to something that already
 * happens on it. Uses the habit's own cue when one is set.
 */
export function oneFixStackHint(insight: OneFixInsight, cue?: string): string {
  const day = insight.weakest.plural.slice(0, -1);
  const anchor = cue?.trim();
  return anchor
    ? `Try stacking it onto "${anchor}" on ${day}s too.`
    : `Try stacking it onto something you already do every ${day}.`;
}
