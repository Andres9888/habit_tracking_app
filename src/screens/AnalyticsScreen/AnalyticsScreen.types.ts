/**
 * Type definitions for AnalyticsScreen
 */

import type { Id } from '../../../convex/_generated/dataModel';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  emoji?: string;
  onPress?: () => void;
  loading?: boolean;
}

export interface AnalyticsOverviewStats {
  totalHabits: number;
  averageStrength: number;
  strongestHabit: {
    id: Id<'habits'>;
    name: string;
    emoji: string;
    strength: number;
  } | null;
  weakestHabit: {
    id: Id<'habits'>;
    name: string;
    emoji: string;
    strength: number;
  } | null;
  rankedHabits: RankedHabit[];
}

export interface RankedHabit {
  id: Id<'habits'>;
  name: string;
  emoji: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  isAtRisk: boolean;
}

export interface StrengthDistributionData {
  automatic: { count: number; percentage: number };
  strong: { count: number; percentage: number };
  developing: { count: number; percentage: number };
  building: { count: number; percentage: number };
  starting: { count: number; percentage: number };
}

export interface TrendDataPoint {
  date: string;
  averageStrength: number;
}

export interface ComplianceDay {
  date: string;
  completionRate: number;
  level: 'none' | 'low' | 'medium' | 'high';
  completedHabits: number;
  totalHabits: number;
}

export interface HabitChange {
  habitId: Id<'habits'>;
  name: string;
  emoji: string;
  changePercent: number;
  previousStrength: number;
  currentStrength: number;
}

export interface WeeklyInsights {
  gainedStrength: HabitChange[];
  lostStrength: HabitChange[];
  atRisk: HabitChange[];
  totalCompletionsThisWeek: number;
  totalCompletionsLastWeek: number;
  weekOverWeekChange: number;
  generatedAt: string;
}

export type ExportFormat = 'csv' | 'json';

export interface UseAnalyticsScreenReturn {
  // State
  refreshing: boolean;
  showPaywall: boolean;
  showExportMenu: boolean;
  isPremiumUser: boolean;
  isLoading: boolean;

  // Data
  overviewStats: AnalyticsOverviewStats | undefined;
  strengthDistribution: StrengthDistributionData | undefined;
  trendData: TrendDataPoint[] | undefined;
  complianceData: ComplianceDay[] | undefined;
  weeklyInsights: WeeklyInsights | undefined;

  // Handlers
  onRefresh: () => Promise<void>;
  handleHabitPress: (habitId: string) => void;
  handleExportPress: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  handleStartTrial: () => void;
  setShowPaywall: (show: boolean) => void;
  setShowExportMenu: (show: boolean) => void;
}
