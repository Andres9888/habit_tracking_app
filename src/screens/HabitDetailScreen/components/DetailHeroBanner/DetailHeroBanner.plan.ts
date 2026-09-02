/**
 * The if-then plan line under the habit name.
 *
 * Lives beside `DetailHeroBanner.utils.ts` rather than inside it purely for the
 * 100-line rule; `scheduleLabel` is the shared fallback so it is imported back.
 */

import type { Habit } from '../../../../features/habits/types';
import { frequencyLabel, scheduleLabel } from './DetailHeroBanner.utils';

/** Longest cue we will print before the plan line starts wrapping. */
const MAX_CUE_LENGTH = 40;

/** "07:30" (and tolerated "7:30 AM") → "7:30 AM". Null when malformed. */
export function reminderClock(reminderTime?: string): string | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(
    reminderTime?.trim() ?? ''
  );
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function cueText(habit: Habit): string | null {
  const cue = habit.cueAfterBehavior?.trim();
  if (!cue) return null;
  if (cue.length <= MAX_CUE_LENGTH) return cue;
  return `${cue.slice(0, MAX_CUE_LENGTH - 1).trimEnd()}…`;
}

/**
 * The if-then plan under the habit name — "After morning coffee · 7:30 AM
 * reminder". Implementation intentions only work when the plan is visible, and
 * the habit already stores both halves. Falls back to the schedule line so the
 * row is never empty. The reminder half is dropped when reminders are off.
 */
export function planLabel(habit: Habit): string {
  const cue = cueText(habit);
  const reminder =
    habit.remindersEnabled === false ? null : reminderClock(habit.reminderTime);
  if (cue !== null && reminder !== null) {
    return `After ${cue} · ${reminder} reminder`;
  }
  if (cue !== null) return `After ${cue}`;
  // Cadence only: `scheduleLabel` derives its time group from the same
  // reminder, so it would say "7:30 AM reminder · Morning routine".
  if (reminder !== null) return `${reminder} reminder · ${frequencyLabel(habit)}`;
  return scheduleLabel(habit);
}
