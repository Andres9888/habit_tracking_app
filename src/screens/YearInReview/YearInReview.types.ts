/**
 * Year In Review Types
 */

export interface YearInReviewData {
  year: number;
  totalCompletions: number;
  activeDays: number;
  totalHabits: number;
  longestStreak: number;
  longestStreakHabitName: string;
  mostConsistentHabit: {
    name: string;
    icon: string;
    count: number;
  } | null;
  bestMonth: string;
  bestMonthCount: number;
  topHabits: Array<{
    name: string;
    icon: string;
    count: number;
  }>;
}

export interface YearInReviewProps {
  visible: boolean;
  onClose: () => void;
}

/** A single "slide" in the animated reveal sequence */
export interface RevealSlide {
  key: string;
  title: string;
  emoji: string;
  value: string;
  subtitle: string;
  color: string;
}
