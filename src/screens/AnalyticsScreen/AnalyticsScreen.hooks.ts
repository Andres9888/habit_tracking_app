/**
 * Business logic hooks for AnalyticsScreen
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';
import type {
  ExportFormat,
  UseAnalyticsScreenReturn,
} from './AnalyticsScreen.types';

export const useAnalyticsScreen = (): UseAnalyticsScreenReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { isPremium: isPremiumUser } = usePremium();
  const [showPaywall, setShowPaywall] = useState(!isPremiumUser);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Skip all analytics queries when the paywall is shown — avoids 5 unnecessary
  // Convex subscriptions for free users, reducing backend load and speeding up
  // the screen transition.
  const shouldFetch = isPremiumUser || !showPaywall;
  const overviewStats = useQuery(
    api.analytics.getOverviewStats,
    shouldFetch ? undefined : 'skip'
  );
  const strengthDistribution = useQuery(
    api.analytics.getStrengthDistribution,
    shouldFetch ? undefined : 'skip'
  );
  const trendData = useQuery(
    api.analytics.get30DayTrend,
    shouldFetch ? undefined : 'skip'
  );
  const complianceData = useQuery(
    api.analytics.getComplianceData,
    shouldFetch ? undefined : 'skip'
  );
  const weeklyInsights = useQuery(
    api.analytics.getWeeklyInsights,
    shouldFetch ? undefined : 'skip'
  );

  const isLoading = shouldFetch && !overviewStats;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries automatically refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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
    isLoading,
    handleExportPress,
    isPremiumUser,
    handleExport,
    onRefresh,
    handleHabitPress,
    refreshing,
    handleStartTrial,
    showExportMenu,
    overviewStats,
    showPaywall,
    setShowExportMenu,
    setShowPaywall,
    strengthDistribution,
    trendData,
    weeklyInsights,
  };
};
