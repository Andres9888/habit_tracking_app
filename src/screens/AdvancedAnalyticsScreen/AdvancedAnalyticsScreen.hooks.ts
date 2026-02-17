/**
 * Business logic hooks for AdvancedAnalyticsScreen
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { exportData, prepareExportData } from '../../utils/exportData';
import { usePremium } from '../../hooks/usePremium/usePremium';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '../../theme/ThemeContext';
import type {
  ExportFormat,
} from '../AnalyticsScreen/AnalyticsScreen.types';

export interface UseAdvancedAnalyticsReturn {
  // State
  refreshing: boolean;
  showPaywall: boolean;
  showExportMenu: boolean;
  isPremiumUser: boolean;
  isLoading: boolean;
  darkMode: boolean;

  // Data
  githubHeatmapData: ReturnType<typeof api.analytics.getGitHubHeatmapData> | undefined;
  streakTrendsData: ReturnType<typeof api.analytics.getStreakTrends> | undefined;
  dayAnalysisData: ReturnType<typeof api.analytics.getDayAnalysis> | undefined;
  streakIntervalsData: ReturnType<typeof api.analytics.getStreakIntervals> | undefined;
  analyticsExportData: ReturnType<typeof api.analytics.getAnalyticsExportData> | undefined;

  // Handlers
  onRefresh: () => Promise<void>;
  handleExportPress: () => void;
  handleExport: (format: ExportFormat) => Promise<void>;
  handleStartTrial: () => void;
  setShowPaywall: (show: boolean) => void;
  setShowExportMenu: (show: boolean) => void;
}

export const useAdvancedAnalytics = (): UseAdvancedAnalyticsReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { isPremium: isPremiumUser } = usePremium();
  const [showPaywall, setShowPaywall] = useState(!isPremiumUser);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { triggerLightImpact } = useHapticFeedback();
  const { darkMode } = useThemeColors();

  // Fetch advanced analytics data from Convex
  const githubHeatmapData = useQuery(api.analytics.getGitHubHeatmapData);
  const streakTrendsData = useQuery(api.analytics.getStreakTrends);
  const dayAnalysisData = useQuery(api.analytics.getDayAnalysis);
  const streakIntervalsData = useQuery(api.analytics.getStreakIntervals);
  const analyticsExportData = useQuery(api.analytics.getAnalyticsExportData);

  const isLoading =
    !githubHeatmapData ||
    !streakTrendsData ||
    !dayAnalysisData ||
    !streakIntervalsData;

  const onRefresh = useCallback(async () => {
    triggerLightImpact(); // Haptic feedback when pull-to-refresh activates
    setRefreshing(true);
    // Convex queries automatically refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, [triggerLightImpact]);

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
        if (!analyticsExportData) {
          throw new Error('No data available to export');
        }

        const exportDataObj = await prepareExportData(
          analyticsExportData.habits.map((h) => ({
            id: h.habitId,
            name: h.habitName,
            completedDates: [],
            strength: h.strength,
            currentStreak: h.currentStreak,
            longestStreak: h.longestStreak,
          })),
          [],
          undefined
        );

        await exportData(exportDataObj, format);

        Alert.alert(
          'Success',
          `Analytics data exported successfully as ${format.toUpperCase()}`,
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
    [analyticsExportData]
  );

  const handleStartTrial = useCallback(() => {
    setShowPaywall(false);
  }, []);

  return {
    darkMode,
    dayAnalysisData,
    githubHeatmapData,
    handleExport,
    handleExportPress,
    handleStartTrial,
    isPremiumUser,
    isLoading,
    onRefresh,
    refreshing,
    setShowExportMenu,
    setShowPaywall,
    showExportMenu,
    showPaywall,
    streakIntervalsData,
    streakTrendsData,
    analyticsExportData,
  };
};
