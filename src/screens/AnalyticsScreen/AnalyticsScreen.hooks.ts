/**
 * Business logic hooks for AnalyticsScreen
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import type {
  ExportFormat,
  UseAnalyticsScreenReturn,
} from './AnalyticsScreen.types';

export const useAnalyticsScreen = (): UseAnalyticsScreenReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // TODO(integration): Replace with actual premium status check from RevenueCat
  // Temporarily set to true to allow development/testing of premium features
  const isPremiumUser = true;

  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsights = useQuery(api.analytics.getWeeklyInsights);

  const isLoading = !overviewStats;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries automatically refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleHabitPress = useCallback((habitId: string) => {
    console.log('Navigate to habit detail:', habitId);
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
        console.error('Export error:', error);
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
    Alert.alert(
      'Start Trial',
      'This would open the subscription flow with RevenueCat/StoreKit integration',
      [{ text: 'OK' }]
    );
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
