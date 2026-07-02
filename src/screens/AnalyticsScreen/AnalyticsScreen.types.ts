/**
 * Type definitions for AnalyticsScreen
 */

import type { StrengthDistributionData } from '../../components/StrengthDistributionChart/StrengthDistributionChart.types';
import type { TrendData } from '../../components/TrendLineChart/types';
import type { HeatmapData } from '../../components/ComplianceHeatmap/ComplianceHeatmap.types';
import type { WeeklyInsights } from '../../components/WeeklyInsightsCard';

// Re-export canonical chart types for consumers
export type { StrengthDistributionData } from '../../components/StrengthDistributionChart/StrengthDistributionChart.types';
export type { TrendData as TrendDataPoint } from '../../components/TrendLineChart/types';
export type { HeatmapData as ComplianceDay } from '../../components/ComplianceHeatmap/ComplianceHeatmap.types';
export type { WeeklyInsights } from '../../components/WeeklyInsightsCard';

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
    id: string;
    name: string;
    emoji?: string;
    strength: number;
  } | null;
  weakestHabit: {
    id: string;
    name: string;
    emoji?: string;
    strength: number;
  } | null;
  rankedHabits: RankedHabit[];
}

export interface RankedHabit {
  id: string;
  name: string;
  emoji?: string;
  strength: number;
  rank?: number;
  currentStreak?: number;
  longestStreak?: number;
  isAtRisk?: boolean;
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
  trendData: TrendData[] | undefined;
  complianceData: HeatmapData[] | undefined;
  weeklyInsights: WeeklyInsights | undefined;
  cacheSavedAt: number | undefined;

  // Handlers
  onRefresh: () => Promise<void>;
  handleHabitPress: (habitId: string) => void;
  handleExportPress: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  handleStartTrial: () => void;
  setShowPaywall: (show: boolean) => void;
  setShowExportMenu: (show: boolean) => void;
}
