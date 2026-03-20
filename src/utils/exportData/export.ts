/**
 * Export data using iOS Share Sheet or Native Handset sharing
 */

import { Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { convertToCSV, convertToJSON } from './converters';
import { AUTO_DISMISS_DELAY_MS } from '@/constants';
import type { ExportData, ToastResult } from './types';

/**
 * Export data using iOS Share Sheet or Native Handset sharing
 */
export async function exportData(
  data: ExportData,
  format: 'csv' | 'json'
): Promise<void> {
  try {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = convertToCSV(data);
      filename = `habits_export_${Date.now()}.csv`;
      mimeType = 'text/csv';
    } else {
      content = convertToJSON(data);
      filename = `habits_export_${Date.now()}.json`;
      mimeType = 'application/json';
    }

    // Create temporary file
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Export Habit Data',
        mimeType,
        UTI:
          format === 'csv'
            ? 'public.comma-separated-values-text'
            : 'public.json',
      });
    } else if (Platform.OS === 'ios') {
      await Share.share({ title: 'Export Habit Data', url: fileUri });
    } else {
      await Share.share({ message: content, title: 'Export Habit Data' });
    }

    // Clean up temporary file after a delay
    setTimeout(() => {
      FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(() => {
        // Ignore cleanup errors
      });
    }, AUTO_DISMISS_DELAY_MS);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('User canceled') ||
        error.message.includes('cancelled')
      ) {
        return;
      }
      throw error;
    }
  }
}

/**
 * Show success toast after export
 */
export function showExportSuccess(format: 'csv' | 'json'): ToastResult {
  return {
    duration: 3000,
    message: `Data exported successfully as ${format.toUpperCase()}`,
    type: 'success',
  };
}

/**
 * Show error toast on export failure
 */
export function showExportError(error: Error): ToastResult {
  return {
    duration: 4000,
    message: `Export failed: ${error.message}`,
    type: 'error',
  };
}
