/**
 * useHabitExport Hook
 * Handles CSV export of habit completion history
 */
import { useCallback, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface ExportData {
  habitName: string;
  date: string;
  completed: boolean;
  streak: number;
  notes: string;
}

function convertToCSV(data: ExportData[]): string {
  const headers = ['Habit Name', 'Date', 'Completed', 'Streak', 'Notes'];
  const rows = data.map((row) => [
    `"${row.habitName.replace(/"/g, '""')}"`,
    row.date,
    row.completed ? 'Yes' : 'No',
    row.streak.toString(),
    `"${row.notes.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function useHabitExport() {
  const [isExporting, setIsExporting] = useState(false);
  const exportData = useQuery(api.habits.getHabitCompletionHistory);

  const exportToCSV = useCallback(async () => {
    if (!exportData || exportData.length === 0) {
      return { success: false, error: 'No data to export' };
    }

    setIsExporting(true);

    try {
      const csv = convertToCSV(exportData);
      const fileName = `habit-completion-history-${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return { success: false, error: 'Sharing is not available on this device' };
      }

      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Habit Completion History',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    } finally {
      setIsExporting(false);
    }
  }, [exportData]);

  return {
    exportToCSV,
    isExporting,
    hasData: exportData && exportData.length > 0,
  };
}
