/**
 * Business logic hooks for AnalyticsScreen
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { maybeRequestReviewFromAnalytics } from '@/utils/storeReview';
import { useAnalyticsQueries } from './hooks/useAnalyticsQueries';
import { useAnalyticsActions } from './hooks/useAnalyticsActions';
import type { UseAnalyticsScreenReturn } from './AnalyticsScreen.types';

export const useAnalyticsScreen = (): UseAnalyticsScreenReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { triggerLightImpact } = useHapticFeedback();
  const hasCheckedReview = useRef(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    overviewStats,
    strengthDistribution,
    trendData,
    complianceData,
    weeklyInsights,
    isLoading,
  } = useAnalyticsQueries();

  const {
    isPremiumUser,
    showExportMenu,
    setShowExportMenu,
    handleExportPress,
    handleExport,
    handleHabitPress,
    handlePresentPaywall,
  } = useAnalyticsActions({ overviewStats });

  useEffect(() => {
    if (
      !hasCheckedReview.current &&
      !isLoading &&
      overviewStats &&
      complianceData &&
      complianceData.length > 0
    ) {
      hasCheckedReview.current = true;
      const avgCompletionRate =
        complianceData.reduce((sum, day) => sum + day.completionRate, 0) /
        complianceData.length;
      const totalHabits = overviewStats.totalHabits || 0;
      void maybeRequestReviewFromAnalytics(avgCompletionRate, totalHabits);
    }
  }, [isLoading, overviewStats, complianceData]);

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

  return {
    complianceData,
    handleExport,
    handleExportPress,
    handleHabitPress,
    handlePresentPaywall,
    isLoading,
    isPremiumUser,
    onRefresh,
    overviewStats,
    refreshing,
    setShowExportMenu,
    showExportMenu,
    strengthDistribution,
    trendData,
    weeklyInsights,
  };
};
