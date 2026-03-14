/**
 * Analytics Actions Hook
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { exportData, prepareExportData } from '../../../utils/exportData';
import { usePremium } from '../../../hooks/usePremium/usePremium';
import { useNativePaywall } from '../../../hooks/useNativePaywall';
import type { ExportFormat } from '../AnalyticsScreen.types';

interface UseAnalyticsActionsProps {
  overviewStats: any;
}

export const useAnalyticsActions = ({
  overviewStats,
}: UseAnalyticsActionsProps) => {
  const { isPremium: isPremiumUser } = usePremium();
  const { presentPaywall } = useNativePaywall();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPress = useCallback(() => {
    if (!isPremiumUser) {
      void presentPaywall({ source: 'analytics_export' });
      return;
    }
    setShowExportMenu(true);
  }, [isPremiumUser, presentPaywall]);

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

  const handlePresentPaywall = useCallback(() => {
    void presentPaywall({ source: 'analytics_screen' });
  }, [presentPaywall]);

  const handleHabitPress = useCallback((_habitId: string) => {
    // TODO: navigate to habit detail
  }, []);

  return {
    handleExport,
    handleExportPress,
    handleHabitPress,
    handlePresentPaywall,
    isPremiumUser,
    setShowExportMenu,
    showExportMenu,
  };
};
