export interface StreakReminderHabit {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  currentStreak: number;
  completedToday: boolean;
  /** Per-habit custom reminder time (premium only), "HH:mm" format */
  customReminderTime?: string;
}
