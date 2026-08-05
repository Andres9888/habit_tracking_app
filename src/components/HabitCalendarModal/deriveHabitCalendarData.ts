import { format } from 'date-fns';
import { getEmojiAndName } from '../DraggableHabit/DraggableHabit.hooks';
import {
  calculateBestStreak,
  calculateCompletionPercentage,
} from '../../utils/habitCalculations';
import { buildScheduleLabel, getLatestMissedBadge } from './utils';
import type { Habit, TrackingEntry } from './types';

/**
 * Pure derivation for the habit calendar modal.
 *
 * Extracted from the hook so it can sit behind a single `useMemo` — the caller
 * only runs it when the modal is actually open and its inputs changed.
 */
export function deriveHabitCalendarData(
  habit: Habit,
  tracking: TrackingEntry[]
) {
  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const { emoji, name } = getEmojiAndName(habit.name);
  const habitTrackingEntries = tracking.filter((t) => t.habitId === habit._id);
  const habitTracking = habitTrackingEntries.map((t) => ({
    completed: t.completed,
    date: t.date,
  }));
  const todayTracking = habitTrackingEntries.find(
    (t) => t.date === todayDateString
  );

  return {
    bestStreak: calculateBestStreak(habitTracking),
    completionPercentage: calculateCompletionPercentage(
      habit.createdAt || Date.now(),
      habitTracking
    ),
    emoji,
    habitTrackingEntries,
    isTodayCompleted: Boolean(todayTracking?.completed),
    name,
    recentMissBadge: getLatestMissedBadge(
      habitTrackingEntries,
      todayDateString
    ),
    scheduleLabel: buildScheduleLabel(habit),
    todayDateString,
  };
}
