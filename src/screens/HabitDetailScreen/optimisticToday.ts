/**
 * applyOptimisticToday — overlay a pending optimistic toggle onto today's
 * server-derived stats so the hero reacts instantly (matching the calendar),
 * then self-reconciles when the server response lands.
 *
 * `optimisticToggle` is the pending completed-state for today, or undefined
 * when there is no pending op (use the server values as-is). The streak math
 * is the common-case ±1: marking today extends the streak, unmarking trims it.
 */

export interface ServerTodayStats {
  completedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export interface OptimisticTodayStats {
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export function applyOptimisticToday(
  server: ServerTodayStats,
  optimisticToggle: boolean | undefined
): OptimisticTodayStats {
  const { completedToday, currentStreak, bestStreak, totalCompletions } =
    server;

  // No pending op, or it agrees with the server → nothing to overlay.
  if (optimisticToggle === undefined || optimisticToggle === completedToday) {
    return {
      isCompletedToday: completedToday,
      currentStreak,
      bestStreak,
      totalCompletions,
    };
  }

  if (optimisticToggle) {
    const streak = currentStreak + 1;
    return {
      isCompletedToday: true,
      currentStreak: streak,
      bestStreak: Math.max(bestStreak, streak),
      totalCompletions: totalCompletions + 1,
    };
  }

  return {
    isCompletedToday: false,
    currentStreak: Math.max(0, currentStreak - 1),
    bestStreak,
    totalCompletions: Math.max(0, totalCompletions - 1),
  };
}
