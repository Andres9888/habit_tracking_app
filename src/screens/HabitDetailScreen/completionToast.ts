export interface CompletionToastSnapshot {
  /** Frozen at fire time — see `getNextCompletionToast`. */
  streak: number;
  /** The date the toast is offering to undo; null until it has fired. */
  date: string | null;
  visible: boolean;
}

interface CompletionToastTransitionInput extends CompletionToastSnapshot {
  currentStreak: number;
  didHabitChange: boolean;
  isCompletedToday: boolean;
  previousCompletedToday: boolean | null;
  /** Today as YYYY-MM-DD — captured when the toast fires, not when it is read. */
  today: string;
}

export function deriveCompletionToastStreak(currentStreak: number): number {
  return currentStreak > 0 ? currentStreak : 1;
}

/**
 * The streak and the date are captured ONLY on the not-logged → logged
 * transition. Recomputing them on every call let the sentence rewrite itself
 * mid-display when the server value landed after the optimistic one, and let
 * Undo target whatever "today" happened to be at press time rather than the day
 * the toast was actually about.
 */
export function getNextCompletionToast({
  currentStreak,
  date,
  didHabitChange,
  isCompletedToday,
  previousCompletedToday,
  streak,
  today,
  visible,
}: CompletionToastTransitionInput): CompletionToastSnapshot {
  const held = { date, streak };

  if (didHabitChange) return { ...held, visible: false };
  if (previousCompletedToday === null) return { ...held, visible: false };
  if (!previousCompletedToday && isCompletedToday) {
    return {
      date: today,
      streak: deriveCompletionToastStreak(currentStreak),
      visible: true,
    };
  }
  if (previousCompletedToday && !isCompletedToday) {
    return { ...held, visible: false };
  }
  return { ...held, visible };
}
