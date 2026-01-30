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

export interface StrengthDistributionData {
  automatic: { count: number; percentage: number };
  strong: { count: number; percentage: number };
  developing: { count: number; percentage: number };
  building: { count: number; percentage: number };
  starting: { count: number; percentage: number };
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface ComplianceDay {
  date: string;
  compliance: number;
}

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
  overviewStats: AnalyticsOverviewStats | undefined;
  strengthDistribution: StrengthDistributionData | undefined;
  trendData: TrendDataPoint[] | undefined;
  complianceData: ComplianceDay[] | undefined;
  weeklyInsights: WeeklyInsight[] | undefined;

  // Handlers
  onRefresh: () => Promise<void>;
  handleHabitPress: (habitId: string) => void;
  handleExportPress: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  handleStartTrial: () => void;
  setShowPaywall: (show: boolean) => void;
  setShowExportMenu: (show: boolean) => void;
}
