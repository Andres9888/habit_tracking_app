/**
 * WeeklyInsightsCard Types
 */

export interface HabitChange {
  habitId: string;
  name: string;
  emoji: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  percentageChange: number;
  currentStreak: number;
}

export interface WeeklyInsights {
  weekOverWeekChange: number;
  totalCompletionsThisWeek: number;
  totalCompletionsLastWeek: number;
  gainedStrength: HabitChange[];
  lostStrength: HabitChange[];
  atRisk: HabitChange[];
  generatedAt: string;
}

export interface WeeklyInsightsCardProps {
  insights: WeeklyInsights | null;
  onHabitPress?: (habitId: string) => void;
  onArchivePress?: () => void;
}

export type HabitChangeType = 'gained' | 'lost' | 'risk';
