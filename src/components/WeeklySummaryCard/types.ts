export interface DayStats {
  date: string;
  completed: number;
  total: number;
}

export interface WeeklySummaryStats {
  bestDay: DayStats | null;
  bestDayRate: number;
  completionRate: number;
  consecutivePerfectDays: number;
  perfectDays: number;
  totalCompleted: number;
  totalPossible: number;
}

export interface WeeklySummaryCardProps {
  /** Stats for each day of the week */
  weekStats: DayStats[];
  /** Current streak across all habits (average or max) */
  currentStreak?: number;
  /** Best streak achieved this week */
  bestStreakThisWeek?: number;
  /** Whether the week is complete (it's Sunday or later) */
  isWeekComplete?: boolean;
  /** Callback when user taps to view details */
  onViewDetails?: () => void;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Whether to show the card */
  visible?: boolean;
}

export interface MotivationalMessage {
  text: string;
  type: 'excellent' | 'great' | 'good' | 'building' | 'starting';
}

export interface ColorScheme {
  bg: string;
  accent: string;
  text: string;
}
