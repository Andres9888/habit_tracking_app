/**
 * Hook for full GDPR-compliant data export from Settings
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  prepareFullExportData,
  convertFullExportToJSON,
  convertFullExportToCSV,
} from '../utils/exportData';
import { exportFile } from '../utils/exportData/exportFile';

type ExportFormat = 'json' | 'csv';

export function useFullDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const rawData = useQuery(api.exportUserData.getAllUserData);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (!rawData) {
        Alert.alert('Export Error', 'Unable to load your data. Please try again.');
        return;
      }

      setIsExporting(true);

      // Use setTimeout to let the UI update before heavy work
      setTimeout(() => {
        void (async () => {
          try {
            const fullData = prepareFullExportData(rawData);
            const content =
              format === 'json'
                ? convertFullExportToJSON(fullData)
                : convertFullExportToCSV(fullData);
            const filename = `chainday_full_export_${Date.now()}.${format}`;
            const mimeType =
              format === 'json' ? 'application/json' : 'text/csv';

            await exportFile(content, filename, mimeType, format);
          } catch (error) {
            Alert.alert(
              'Export Failed',
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred.'
            );
          } finally {
            setIsExporting(false);
          }
        })();
      }, 100);
    },
    [rawData]
  );

  const promptExport = useCallback(() => {
    Alert.alert(
      'Export My Data',
      'Choose a format for your data export. JSON is recommended for completeness; CSV is better for spreadsheets.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => handleExport('csv'),
          text: 'CSV',
        },
        {
          onPress: () => handleExport('json'),
          text: 'JSON (Recommended)',
        },
      ]
    );
  }, [handleExport]);

  return {
    isDataLoaded: rawData !== undefined,
    isExporting,
    promptExport,
  };
}
