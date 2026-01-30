/**
 * WeeklyInsightsCard Types
 */

export interface WeeklyInsight {
  day: number; // 0-6 (Sunday-Saturday)
  completions: number;
  possible: number;
}

export interface WeeklyInsightsCardProps {
  /** Completion percentage (0-100) */
  completionRate: number;
  /** Best day of the week (0=Sunday, 6=Saturday) */
  bestDay: number;
  /** Total habits completed this week */
  totalCompleted: number;
  /** Total possible completions this week */
  totalPossible: number;
  /** Number of streaks at risk (habits not done today with active streaks) */
  streaksAtRisk: number;
  /** Trend compared to last week */
  trend: 'up' | 'down' | 'same';
  /** Callback when card is pressed */
  onPress?: () => void;
}
