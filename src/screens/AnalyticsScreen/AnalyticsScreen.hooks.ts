/**
 * Business logic hooks for AnalyticsScreen
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
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

  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsightsRaw = useQuery(api.analytics.getWeeklyInsights);
  const weeklyInsights = (weeklyInsightsRaw && 'weekOverWeekChange' in weeklyInsightsRaw ? weeklyInsightsRaw : undefined) as import('../../components/WeeklyInsightsCard').WeeklyInsights | undefined;

  const isLoading = !overviewStats;
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute trend indicators from 30-day data
  const strengthTrend = useMemo(() => {
    if (!trendData || trendData.length < 14) return undefined;
    const recent = trendData.slice(-7);
    const previous = trendData.slice(-14, -7);
    const recentAvg =
      recent.reduce((s, d) => s + d.averageStrength, 0) / recent.length;
    const previousAvg =
      previous.reduce((s, d) => s + d.averageStrength, 0) / previous.length;
    const diff = recentAvg - previousAvg;
    const absDiff = Math.abs(Math.round(diff));
    if (absDiff < 1)
      return { direction: 'neutral' as const, label: 'Steady vs last week' };
    return {
      direction: diff > 0 ? ('up' as const) : ('down' as const),
      label: `${absDiff}% vs last week`,
    };
  }, [trendData]);

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
    strengthTrend,
    trendData,
    weeklyInsights: weeklyInsights ?? undefined,
  };
};
