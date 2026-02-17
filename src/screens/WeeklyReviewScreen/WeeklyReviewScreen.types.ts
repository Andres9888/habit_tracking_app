/**
 * WeeklyReviewScreen Types
 */

import { HabitChange } from '@/components/WeeklyInsightsCard/WeeklyInsightsCard.types';

export interface WeeklyReviewData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalCompletions: number;
  totalPossibleCompletions: number;
  completionRate: number;
  weekOverWeekChange: number;
  bestHabits: HabitChange[];
  worstHabits: HabitChange[];
  streaksGained: Array<{
    habitId: string;
    name: string;
    emoji: string;
    streakLength: number;
  }>;
  streaksLost: Array<{
    habitId: string;
    name: string;
    emoji: string;
    streakLength: number;
  }>;
  generatedAt: string;
}

export interface UseWeeklyReviewReturn {
  isLoading: boolean;
  refreshing: boolean;
  reviewData: WeeklyReviewData | null;
  intention: string;
  showShareModal: boolean;
  onRefresh: () => Promise<void>;
  onIntentionChange: (text: string) => void;
  onSaveIntention: () => Promise<void>;
  onShare: () => void;
  setShowShareModal: (show: boolean) => void;
}
