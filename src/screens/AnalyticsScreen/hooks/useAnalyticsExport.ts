/**
 * Analytics Export Hook
 * Handles data export functionality
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { ExportFormat } from '../../../lib/dataExport';
import { exportData, prepareExportData } from '../../../lib/dataExport';
import { useIsPremiumUser } from '../../../hooks/useIsPremiumUser';
import type { OverviewStats } from './useAnalyticsData';

interface UseAnalyticsExportProps {
  overviewStats?: OverviewStats;
}

export function useAnalyticsExport({ overviewStats }: UseAnalyticsExportProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremiumUser = useIsPremiumUser();

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
    showExportMenu,
    setShowExportMenu,
    showPaywall,
    setShowPaywall,
    isPremiumUser,
    handleExportPress,
    handleExport,
    handleStartTrial,
  };
}
