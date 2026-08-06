/** Copy helpers for the hero band eyebrow and strength dial. */

import { getLevelFromStrength } from '../../../../components/ProgressSectionConsolidated/types/levelHelpers';
import type { Habit } from '../../../../features/habits/types';

/** Strength is stored 0-1; the dial and the rest of the app show 0-100. */
export function strengthPercent(habit: Habit): number {
  const raw = habit.strength ?? 0;
  const scaled = raw <= 1 ? raw * 100 : raw;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

export function strengthLabel(percent: number): string {
  return getLevelFromStrength(percent).label;
}

/**
 * Eyebrow above the habit name — "Daily habit", "3 days a week", etc.
 * `daysOfWeek` is only written when the user picks fewer than seven days.
 */
export function scheduleLabel(habit: Habit): string {
  const days = habit.daysOfWeek;
  if (Array.isArray(days) && days.length > 0 && days.length < 7) {
    return days.length === 1 ? 'Once a week' : `${days.length} days a week`;
  }
  if (habit.frequency === 'weekly') return 'Weekly habit';
  return 'Daily habit';
}

/**
 * The two-minute framing line. Leans on the habit's implementation-intention
 * cue when one exists, so the smaller ask still has a concrete trigger.
 */
export function twoMinuteHint(habit: Habit): string {
  const cue = habit.cueAfterBehavior?.trim();
  if (cue) {
    return `${cue}, do the smallest version you'd still be proud of. Showing up is the streak.`;
  }
  return 'Do the smallest version you would still be proud of — two minutes counts. Showing up is the streak.';
}
