/**
 * useHabitTimeGroups — groups habits by time-of-day.
 *
 * Derives time group from `preferredTime` or `reminderTime`.
 * Falls back to "anytime" when neither is set.
 */

import { useMemo } from 'react';
import type { Habit } from '../../../types';
import type { HabitTimeGroup, TimeGroup } from './types';

const GROUP_META: Record<TimeGroup, { label: string; icon: string }> = {
  morning: { label: 'Morning', icon: '🌅' },
  afternoon: { label: 'Afternoon', icon: '☀️' },
  evening: { label: 'Evening', icon: '🌙' },
  anytime: { label: 'Anytime', icon: '⏰' },
};

const GROUP_ORDER: TimeGroup[] = ['morning', 'afternoon', 'evening', 'anytime'];

/**
 * Derive the time group for a habit.
 * 1. Use `preferredTime` if it maps directly to a group.
 * 2. Parse `reminderTime` (e.g. "2:00 PM") to infer group.
 * 3. Default to "anytime".
 */
function getTimeGroup(habit: Habit): TimeGroup {
  // Manual override takes priority
  const manual = (habit as Record<string, unknown>).timeGroup as TimeGroup | undefined;
  if (manual && GROUP_ORDER.includes(manual)) return manual;

  const pt = habit.preferredTime?.toLowerCase();
  if (pt === 'morning' || pt === 'phase1_push') return 'morning';
  if (pt === 'afternoon' || pt === 'phase2_pivot') return 'afternoon';
  if (pt === 'evening' || pt === 'phase3_pull') return 'evening';

  // Try to infer from reminderTime (e.g. "7:00 AM", "2:00 PM")
  const rt = habit.reminderTime;
  if (rt) {
    const hour = parseReminderHour(rt);
    if (hour !== null) {
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      return 'evening';
    }
  }

  return 'anytime';
}

function parseReminderHour(time: string): number | null {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return hour;
}

interface UseHabitTimeGroupsParams {
  habits: Habit[];
  todayString: string;
  getHabitStatus: (habitId: string, dateString: string) => string;
}

export function useHabitTimeGroups({
  habits,
  todayString,
  getHabitStatus,
}: UseHabitTimeGroupsParams): HabitTimeGroup[] {
  return useMemo(() => {
    const buckets = new Map<TimeGroup, Habit[]>();
    for (const key of GROUP_ORDER) {
      buckets.set(key, []);
    }

    for (const habit of habits) {
      const group = getTimeGroup(habit);
      buckets.get(group)!.push(habit);
    }

    return GROUP_ORDER
      .map((key) => {
        const groupHabits = buckets.get(key)!;
        const completedCount = groupHabits.filter(
          (h) => getHabitStatus(h._id, todayString) === 'done'
        ).length;
        return {
          key,
          label: GROUP_META[key].label,
          icon: GROUP_META[key].icon,
          habits: groupHabits,
          completedCount,
          totalCount: groupHabits.length,
        };
      })
      .filter((g) => g.totalCount > 0);
  }, [habits, todayString, getHabitStatus]);
}

export { getTimeGroup };
