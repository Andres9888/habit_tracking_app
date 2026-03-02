import { useMemo } from 'react';

interface StreakBadge {
  emoji: string;
  text: string;
}

export interface StreakGreetingResult {
  greeting: string;
  badge?: StreakBadge;
}

interface StreakGreetingInput {
  currentStreak: number;
  completedToday: number;
  totalHabits: number;
  /** Current hour (0-23), defaults to new Date().getHours() */
  hour?: number;
}

function getTimeOfDayGreeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
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

  if (currentStreak === 0) {
    return { greeting: getTimeOfDayGreeting(h) };
  }

  if (currentStreak === 1) {
    return { greeting: 'Great start!' };
  }

  if (currentStreak >= 7) {
    return {
      greeting: `${currentStreak}-day streak`,
      badge: { emoji: '⚡', text: 'On fire!' },
    };
  }

  // currentStreak >= 2 && < 7
  return {
    greeting: `${currentStreak}-day streak`,
    badge: { emoji: '🔥', text: 'Keep it going!' },
  };
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
