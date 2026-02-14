/**
 * Type definitions for AnalyticsScreen
 */

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
  rank: number;
}

// Re-export canonical chart types to avoid drift
export type { StrengthDistributionData } from '../../components/StrengthDistributionChart/StrengthDistributionChart.types';
export type { TrendData as TrendDataPoint } from '../../components/TrendLineChart/types';
export type { HeatmapData as ComplianceDay } from '../../components/ComplianceHeatmap/ComplianceHeatmap.types';

export interface WeeklyInsight {
  id: string;
  type: string;
  message: string;
  habitId?: string;
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

  overviewStats: AnalyticsOverviewStats | null;

  strengthDistribution: StrengthDistributionData[];

  trendData: TrendDataPoint[];

  complianceData: ComplianceDay[];

  weeklyInsights: WeeklyInsight[];

  // Handlers
  onRefresh: () => Promise<void>;
  handleHabitPress: (habitId: string) => void;
  handleExportPress: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  handleStartTrial: () => void;
  setShowPaywall: (show: boolean) => void;
  setShowExportMenu: (show: boolean) => void;
}
