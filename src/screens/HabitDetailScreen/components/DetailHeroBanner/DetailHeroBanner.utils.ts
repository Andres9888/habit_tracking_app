/** Copy helpers for the hero band eyebrow and strength dial. */

import { getLevelFromStrength } from '../../../../components/ProgressSectionConsolidated/types/levelHelpers';
import type { Habit } from '../../../../features/habits/types';
import type { HabitDayState } from '../../../../features/habits/habitDayState';
import { reminderHour } from '../../insights';
import type { BandGradient, InsightPalette } from '../../insightPalette';

/**
 * The hero wash. The header tint, the hero gradient and the ScrollView's
 * overscroll fill all read stop 0, so all three must resolve it the same way —
 * hence one helper rather than three copies of the ternary.
 */
export function heroWash(
  palette: InsightPalette,
  todayState: HabitDayState,
  isRecovery: boolean
): BandGradient {
  if (isRecovery) return palette.bandGradientRecovery;
  return todayState === 'completed'
    ? palette.bandGradientDone
    : palette.bandGradient;
}

/** Strength is stored 0-1; the dial and the rest of the app show 0-100. */
export function strengthPercent(habit: Habit): number {
  const raw = habit.strength ?? 0;
  const scaled = raw <= 1 ? raw * 100 : raw;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

export function strengthLabel(percent: number): string {
  return getLevelFromStrength(percent).label;
}

/** Time-of-day grouping from real fields — never invents "Morning routine". */
export function timeGroupLabel(habit: Habit): string | undefined {
  const preferred = habit.preferredTime?.trim().toLowerCase();
  if (preferred === 'morning' || preferred === 'phase1_push') {
    return 'Morning routine';
  }
  if (preferred === 'afternoon' || preferred === 'phase2_pivot') {
    return 'Afternoon routine';
  }
  if (preferred === 'evening' || preferred === 'phase3_pull') {
    return 'Evening routine';
  }

  const cue = habit.cueTime?.trim().toLowerCase() ?? '';
  if (cue.includes('morning')) return 'Morning routine';
  if (cue.includes('afternoon')) return 'Afternoon routine';
  if (cue.includes('evening') || cue.includes('night')) {
    return 'Evening routine';
  }

  const hour = reminderHour(habit.reminderTime);
  if (hour === null) return undefined;
  if (hour < 12) return 'Morning routine';
  if (hour < 17) return 'Afternoon routine';
  return 'Evening routine';
}

/** Cadence from frequency / daysOfWeek. */
export function frequencyLabel(habit: Habit): string {
  const days = habit.daysOfWeek;
  if (Array.isArray(days) && days.length > 0 && days.length < 7) {
    return days.length === 1 ? 'Once a week' : `${days.length} days a week`;
  }
  if (habit.frequency === 'weekly') return 'Weekly';
  if (habit.frequency === 'custom') return 'Custom';
  return 'Daily';
}

/**
 * Schedule line under the habit name — "Morning routine · Daily".
 * `daysOfWeek` is only written when the user picks fewer than seven days.
 */
export function scheduleLabel(habit: Habit): string {
  const group = timeGroupLabel(habit);
  const cadence = frequencyLabel(habit);
  return group ? `${group} · ${cadence}` : cadence;
}

/**
 * The smallest version of THIS habit, sized for the fixed action slot.
 *
 * The old line pasted the habit name into "Try two minutes of {name}", which
 * reads as nonsense for a rule or abstinence habit ("Try two minutes of 24-Hour
 * Purchase Rule"). Templates already carry an authored `startSmallVersion`;
 * when the habit has none, the fallback is type-neutral and never names it.
 */
export function smallVersionHint(habit: Habit): string {
  const authored = habit.startSmallVersion?.trim();
  if (authored) return authored;
  return 'Do the smallest version you’d still call done. It counts.';
}
