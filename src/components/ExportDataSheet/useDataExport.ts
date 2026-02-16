/**
 * useDataExport Hook
 * Handles exporting habit data in CSV and JSON formats
 */

import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { generateCSV, generateJSON, getExportFilename } from '../../utils/dataExport';

export function useDataExport() {
  // Fetch all habits
  const habits = useQuery(api.habits.list, {});
  
  // Fetch tracking data for the past year (or all time)
  // We'll fetch a large date range to capture all tracking data
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 5)
  ).toISOString().split('T')[0];
  
  const tracking = useQuery(api.habits.getTracking, {
    startDate,
    endDate,
  });

  const exportData = useCallback(
    async (format: 'csv' | 'json') => {
      if (!habits || !tracking) {
        Alert.alert('Export Failed', 'Data is still loading. Please try again.');
        return;
      }

      if (habits.length === 0) {
        Alert.alert('No Data', 'You don\'t have any habits to export yet.');
        return;
      }

      try {
        // Transform habits data to safe format (remove sensitive fields)
        const safeHabits = habits.map((habit, index) => ({
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          createdAt: habit._creationTime,
          archived: habit.archived,
          currentStreak: habit.currentStreak,
          bestStreak: habit.bestStreak,
          totalCompletions: habit.totalCompletions,
          strength: habit.strength,
          strengthLevel: habit.strengthLevel,
          frequency: habit.frequency,
          why: habit.why,
          identity: habit.identity,
          cueTime: habit.cueTime,
          cueLocation: habit.cueLocation,
          cueAfterBehavior: habit.cueAfterBehavior,
        }));

        // Create a habit ID mapping (index-based instead of database IDs)
        const habitIdMap = new Map(
          habits.map((habit, index) => [habit._id, index.toString()])
        );

        // Transform tracking data (replace database IDs with indices)
        const safeTracking = tracking.map((t) => ({
          habitId: habitIdMap.get(t.habitId) ?? '0',
          date: t.date,
          completed: t.completed,
        }));

        // Generate content based on format
        const content = format === 'csv' 
          ? generateCSV(safeHabits, safeTracking)
          : generateJSON(safeHabits, safeTracking);

        // Create filename
        const filename = getExportFilename(format);
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;

        // Write file
        await FileSystem.writeAsStringAsync(fileUri, content, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Check if sharing is available
        const canShare = await Sharing.isAvailableAsync();
        
        if (canShare) {
          // Share the file
          await Sharing.shareAsync(fileUri, {
            mimeType: format === 'csv' ? 'text/csv' : 'application/json',
            dialogTitle: 'Export Habit Data',
            UTI: format === 'csv' ? 'public.comma-separated-values-text' : 'public.json',
          });
        } else {
          // Fallback for platforms where sharing isn't available
          Alert.alert(
            'Export Complete',
            `Your data has been saved to: ${fileUri}`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Export error:', error);
        Alert.alert(
          'Export Failed',
          'An error occurred while exporting your data. Please try again.'
        );
      }
    },
    [habits, tracking]
  );

  const exportCSV = useCallback(() => exportData('csv'), [exportData]);
  const exportJSON = useCallback(() => exportData('json'), [exportData]);

  return {
    exportCSV,
    exportJSON,
    isReady: Boolean(habits && tracking),
  };
}
