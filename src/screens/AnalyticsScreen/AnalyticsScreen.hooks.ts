/**
 * Business logic hooks for AnalyticsScreen
 */
<<<<<<< HEAD
import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
=======
import { useState, useCallback } from 'react';
import { useToast } from '../../components/Toast';
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { maybeRequestReviewFromAnalytics } from '@/utils/storeReview';
import type {
  ExportFormat,
  UseAnalyticsScreenReturn,
} from './AnalyticsScreen.types';

export const useAnalyticsScreen = (): UseAnalyticsScreenReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { isPremium: isPremiumUser } = usePremium();
  const [showPaywall, setShowPaywall] = useState(!isPremiumUser);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { triggerLightImpact } = useHapticFeedback();
  const hasCheckedReview = useRef(false);

  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsightsRaw = useQuery(api.analytics.getWeeklyInsights);
  const weeklyInsights = (weeklyInsightsRaw && 'weekOverWeekChange' in weeklyInsightsRaw ? weeklyInsightsRaw : undefined) as import('../../components/WeeklyInsightsCard').WeeklyInsights | undefined;

  const toast = useToast();
  const isLoading = !overviewStats;
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Maybe request review after viewing positive stats (once per session)
  useEffect(() => {
    if (
      !hasCheckedReview.current &&
      !isLoading &&
      overviewStats &&
      complianceData &&
      complianceData.length > 0
    ) {
      hasCheckedReview.current = true;
      // Calculate average completion rate from heatmap data
      const avgCompletionRate =
        complianceData.reduce((sum, day) => sum + day.completionRate, 0) /
        complianceData.length;
      const totalHabits = overviewStats.totalHabits || 0;
      void maybeRequestReviewFromAnalytics(avgCompletionRate, totalHabits);
    }
  }, [isLoading, overviewStats, complianceData]);

  // Cleanup refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    triggerLightImpact(); // Haptic feedback when pull-to-refresh activates
    setRefreshing(true);
    // Convex queries automatically refresh
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => setRefreshing(false), 1000);
  }, [triggerLightImpact]);

  const handleHabitPress = useCallback((_habitId: string) => {
    // TODO: navigate to habit detail
  }, []);

  const handleExportPress = useCallback(() => {
    if (!isPremiumUser) {
      setShowPaywall(true);
      return;
    }
    setShowExportMenu(true);
  }, [isPremiumUser]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setShowExportMenu(false);

      try {
        const exportDataObj = await prepareExportData([], [], overviewStats);
        await exportData(exportDataObj, format);

        toast.success('Export Complete', `Data exported as ${format.toUpperCase()}`);
      } catch (error) {
        if (__DEV__) console.error('Export error:', error);
        toast.error('Export Failed', error instanceof Error ? error.message : 'Unable to export data');
      }
    },
    [overviewStats]
  );

  const handleStartTrial = useCallback(() => {
    setShowPaywall(false);
  }, []);

  return {
    complianceData,
    handleExport,
    handleExportPress,
    handleHabitPress,
    handleStartTrial,
    isLoading,
    isPremiumUser,
    onRefresh,
    overviewStats,
    refreshing,
    setShowExportMenu,
    setShowPaywall,
    showExportMenu,
    showPaywall,
    strengthDistribution,
    trendData,
    weeklyInsights: weeklyInsights ?? undefined,
  };
};
