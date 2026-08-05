export interface ProfileStats {
  activeHabits: number;
  flawlessDays: number;
  lifetimeCompletions: number;
  currentStreak: number;
  /** Share of days this week (Mon→today) with at least one completion, 0–100. */
  weeklyCompletionRate: number;
}

export interface ProfileHabitEntry {
  _id: string | number;
  createdAt?: number;
  currentStreak?: number;
}

export interface ProfileTrackingEntry {
  completed?: boolean;
  date: string;
  habitId: string | number;
}
