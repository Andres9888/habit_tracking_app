/**
 * Analytics Actions Hook
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { exportData, prepareExportData } from '../../../utils/exportData';
import { usePremium } from '../../../hooks/usePremium/usePremium';
import type { ExportFormat } from '../AnalyticsScreen.types';

interface UseAnalyticsActionsProps {
  overviewStats: any;
}

export const useAnalyticsActions = ({
  overviewStats,
}: UseAnalyticsActionsProps) => {
  const { isPremium: isPremiumUser } = usePremium();
  const [showPaywall, setShowPaywall] = useState(!isPremiumUser);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const handleHabitPress = useCallback((_habitId: string) => {
    // TODO: navigate to habit detail
  }, []);

  return {
    isPremiumUser,
    showPaywall,
    setShowPaywall,
    showExportMenu,
    setShowExportMenu,
    handleExportPress,
    handleExport,
    handleStartTrial,
    handleHabitPress,
  };
};
