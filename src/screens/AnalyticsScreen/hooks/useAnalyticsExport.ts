/**
 * Analytics Export Hook
 * Handles data export functionality
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { ExportFormat } from '../../../lib/dataExport';
import { exportData, prepareExportData } from '../../../lib/dataExport';
import { useIsPremiumUser } from '../../../hooks/useIsPremiumUser';
import { useNativePaywall } from '../../../hooks/useNativePaywall';
import type { OverviewStats } from './useAnalyticsData';

interface UseAnalyticsExportProps {
  overviewStats?: OverviewStats;
}

export function useAnalyticsExport({ overviewStats }: UseAnalyticsExportProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const isPremiumUser = useIsPremiumUser();
  const { presentPaywall } = useNativePaywall();

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

  return {
    handleExport,
    handleExportPress,
    isPremiumUser,
    setShowExportMenu,
    showExportMenu,
  };
}
