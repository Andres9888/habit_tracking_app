/**
 * Business logic hooks for AnalyticsScreen
 */

import { Alert } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';

import { useQuery } from 'convex/react';

import type {
  ExportFormat,
  UseAnalyticsScreenReturn,
} from './AnalyticsScreen.types';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';

export const useAnalyticsScreen = (): UseAnalyticsScreenReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { isPremium: isPremiumUser } = usePremium();
  const [showPaywall, setShowPaywall] = useState(!isPremiumUser);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch analytics data from Convex
  const overviewStats = useQuery(api.analytics.getOverviewStats);
  const strengthDistribution = useQuery(api.analytics.getStrengthDistribution);
  const trendData = useQuery(api.analytics.get30DayTrend);
  const complianceData = useQuery(api.analytics.getComplianceData);
  const weeklyInsights = useQuery(api.analytics.getWeeklyInsights);

  const isLoading = !overviewStats;
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup refresh timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries automatically refresh
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => setRefreshing(false), 1000);
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
    weeklyInsights,
  };
};
