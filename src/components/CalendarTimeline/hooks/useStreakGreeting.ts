import { useMemo } from 'react';

export interface StreakGreetingResult {
  greeting: string;
  variant?: 'risk' | 'success' | 'almostDone';
}

interface StreakGreetingInput {
  currentStreak: number;
  completedToday: number;
  totalHabits: number;
  /** Current hour (0-23), defaults to new Date().getHours() */
  hour?: number;
}

/** Pure function — no React hooks, fully testable */
export function getStreakGreeting({
  currentStreak,
  completedToday,
  totalHabits,
  hour,
}: StreakGreetingInput): StreakGreetingResult {
  const h = hour ?? new Date().getHours();

  // Perfect day takes priority
  if (completedToday >= totalHabits && totalHabits > 0) {
    return { greeting: 'Perfect day' };
  }

  // Almost done — 1 habit left
  if (totalHabits > 0 && totalHabits - completedToday === 1) {
    return { greeting: 'Just 1 left!', variant: 'almostDone' };
  }

  // Streak at risk — evening (8pm+), has streak, no progress today
  if (h >= 20 && currentStreak > 0 && completedToday === 0) {
    return {
      greeting: `${currentStreak}-day streak at risk`,
      variant: 'risk',
    };
  }

  // No behavioral value for 0 or 1-day streaks — signal header collapse
  if (currentStreak === 0) {
    return { greeting: '' };
  }

  if (currentStreak === 1) {
    return { greeting: '' };
  }

  if (currentStreak >= 7) {
    return { greeting: `${currentStreak}-day streak` };
  }

  // currentStreak >= 2 && < 7
  return { greeting: `${currentStreak}-day streak` };
}

/** Thin hook wrapper — memoizes the pure function result */
export function useStreakGreeting(
  currentStreak: number,
  completedToday: number,
  totalHabits: number
): StreakGreetingResult {
  return useMemo(
    () => getStreakGreeting({ currentStreak, completedToday, totalHabits }),
    [currentStreak, completedToday, totalHabits]
  );
}
