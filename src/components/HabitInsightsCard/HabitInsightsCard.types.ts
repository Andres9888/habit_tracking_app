/**
 * HabitInsightsCard Types
 */

export type InsightType = 'day_consistency' | 'time_pattern' | 'streak_milestone' | 'strength_progress';

export interface HabitInsight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  emoji: string;
  data?: Record<string, unknown>;
}

export interface HabitInsightsResult {
  insights: HabitInsight[];
  hasEnoughData: boolean;
  daysOfData: number;
  generatedAt: string;
  consistencyScore: number;
}

export interface HabitInsightsCardProps {
  insights: HabitInsightsResult | null | undefined;
  isPremiumUser?: boolean;
  onUnlockPress?: () => void;
}

export interface InsightCardProps {
  insight: HabitInsight;
  backgroundColor: string;
}

export interface PremiumLockOverlayProps {
  onUnlockPress?: () => void;
}
