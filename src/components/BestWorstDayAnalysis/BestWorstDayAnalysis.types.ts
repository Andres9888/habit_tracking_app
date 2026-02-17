/**
 * Type definitions for BestWorstDayAnalysis component
 */

export interface DayAnalysisData {
  bestDay: {
    dayOfWeek: number;
    completionRate: number;
    totalCompletions: number;
  };
  worstDay: {
    dayOfWeek: number;
    completionRate: number;
    totalCompletions: number;
  };
  peakHour: {
    hour: number;
    completions: number;
  };
  dayOfWeekStats: Array<{
    dayOfWeek: number;
    totalCompletions: number;
    totalTracked: number;
    completionRate: number;
  }>;
  hourStats: Array<{
    hour: number;
    completions: number;
  }>;
  period: string;
}

export interface BestWorstDayAnalysisProps {
  data: DayAnalysisData | null;
  darkMode?: boolean;
}
