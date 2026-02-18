/**
 * Business logic hooks for AnalyticsScreen
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { maybeRequestReviewFromAnalytics } from '@/utils/storeReview';
import { logInteraction } from '../../lib/analytics/interactions';
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

  const isLoading = !overviewStats;
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Maybe request review after viewing positive stats (once per session)
   * This feature encourages users to rate the app after seeing their progress.
   * We use a ref to ensure we only show this once per session to avoid being annoying.
   * The calculation computes the average daily completion rate across all tracked days
   * to estimate user engagement level.
   */
  useEffect(() => {
    if (
      !hasCheckedReview.current &&
      !isLoading &&
      overviewStats &&
      complianceData &&
      complianceData.length > 0
    ) {
      hasCheckedReview.current = true;
      // Calculate average completion rate from heatmap data across all tracked days
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

  /**
   * Handle data export in the requested format (CSV or JSON)
   * This function:
   * 1. Closes the export menu modal
   * 2. Prepares analytics data for export
   * 3. Calls the export utility with format preference
   * 4. Shows success/error alerts with appropriate messaging
   */
  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setShowExportMenu(false);

      try {
        const exportDataObj = await prepareExportData([], [], overviewStats);
        await exportData(exportDataObj, format);

        Alert.alert(
          'Success',
          `Data exported successfully as ${format.toUpperCase()}`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        if (__DEV__) console.error('Export error:', error);
        Alert.alert(
          'Export Failed',
          error instanceof Error ? error.message : 'Unable to export data',
          [{ text: 'OK' }]
        );
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
