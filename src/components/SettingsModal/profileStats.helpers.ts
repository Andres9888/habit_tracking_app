import { getLocalDateString } from '../../utils/getLocalDateString';
import type {
  ProfileHabitEntry,
  ProfileStats,
  ProfileTrackingEntry,
} from './profileStats.types';

function getHabitId(value: unknown): string | null {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : null;
}

export function getProfileTrackingStartDate(habits: ProfileHabitEntry[]): string {
  if (habits.length === 0) return getLocalDateString();

  let earliestCreatedAt = Number.POSITIVE_INFINITY;
  for (const habit of habits) {
    if (habit.createdAt != null && habit.createdAt < earliestCreatedAt) {
      earliestCreatedAt = habit.createdAt;
    }
  }

  if (!Number.isFinite(earliestCreatedAt)) return getLocalDateString();
  return getLocalDateString(new Date(earliestCreatedAt));
}

export function buildProfileStats(
  habits: ProfileHabitEntry[],
  tracking: ProfileTrackingEntry[],
): ProfileStats {
  const activeHabitIds = new Set<string>();
  for (const habit of habits) {
    const habitId = getHabitId(habit._id);
    if (habitId) activeHabitIds.add(habitId);
  }

  const activeHabits = activeHabitIds.size;
  if (activeHabits === 0) {
    return { activeHabits: 0, flawlessDays: 0, lifetimeCompletions: 0 };
  }

  const completedByDate = new Map<string, Set<string>>();
  let lifetimeCompletions = 0;

  for (const entry of tracking) {
    if (!entry.completed || typeof entry.date !== 'string') continue;
    const habitId = getHabitId(entry.habitId);
    if (!habitId || !activeHabitIds.has(habitId)) continue;

    lifetimeCompletions += 1;
    let habitsOnDate = completedByDate.get(entry.date);
    if (!habitsOnDate) {
      habitsOnDate = new Set<string>();
      completedByDate.set(entry.date, habitsOnDate);
    }
    habitsOnDate.add(habitId);
  }

  let flawlessDays = 0;
  for (const completedHabits of completedByDate.values()) {
    if (completedHabits.size >= activeHabits) flawlessDays += 1;
  }

  return { activeHabits, flawlessDays, lifetimeCompletions };
}
