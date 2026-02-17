/**
 * Business logic hooks for WeeklyReviewScreen
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import type { UseWeeklyReviewReturn, WeeklyReviewData } from './WeeklyReviewScreen.types';

export const useWeeklyReview = (): UseWeeklyReviewReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const [intention, setIntention] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const { triggerLightImpact, triggerSuccess } = useHapticFeedback();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch weekly insights from Convex
  const weeklyInsights = useQuery(api.analytics.getWeeklyInsights);
  const habits = useQuery(api.habits.list);
  const streaksData = useQuery(api.analytics.getOverviewStats);

  // TODO: Create mutation for saving weekly intention
  // const saveIntention = useMutation(api.reflections.saveWeeklyIntention);

  const isLoading = !weeklyInsights || !habits;

  // Transform insights into review data
  const reviewData: WeeklyReviewData | null = useMemo(() => {
    if (!weeklyInsights || !habits) return null;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const activeHabits = habits.filter((h: any) => !h.archived && !h.paused);
    const totalPossibleCompletions = activeHabits.length * 7;

    return {
      weekNumber: getWeekNumber(now),
      startDate: weekStart.toISOString(),
      endDate: now.toISOString(),
      totalCompletions: weeklyInsights.totalCompletionsThisWeek,
      totalPossibleCompletions,
      completionRate: totalPossibleCompletions > 0 
        ? (weeklyInsights.totalCompletionsThisWeek / totalPossibleCompletions) * 100 
        : 0,
      weekOverWeekChange: weeklyInsights.weekOverWeekChange,
      bestHabits: weeklyInsights.gainedStrength.slice(0, 3),
      worstHabits: weeklyInsights.lostStrength.slice(0, 3),
      streaksGained: [], // TODO: Track streak changes
      streaksLost: [], // TODO: Track streak changes
      generatedAt: weeklyInsights.generatedAt,
    };
  }, [weeklyInsights, habits]);

  // Cleanup refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    triggerLightImpact();
    setRefreshing(true);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => setRefreshing(false), 1000);
  }, [triggerLightImpact]);

  const onIntentionChange = useCallback((text: string) => {
    setIntention(text);
  }, []);

  const onSaveIntention = useCallback(async () => {
    if (!intention.trim()) return;
    
    try {
      // TODO: Save intention to database
      // await saveIntention({ intention, week: reviewData?.weekNumber });
      triggerSuccess();
      setIntention('');
    } catch (error) {
      console.error('Failed to save intention:', error);
    }
  }, [intention, triggerSuccessHaptic]);

  const onShare = useCallback(() => {
    triggerLightImpact();
    setShowShareModal(true);
  }, [triggerLightImpact]);

  return {
    isLoading,
    refreshing,
    reviewData,
    intention,
    showShareModal,
    onRefresh,
    onIntentionChange,
    onSaveIntention,
    onShare,
    setShowShareModal,
  };
};

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
