import { Share, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface HabitData {
  id: string;
  name: string;
  icon?: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  completions: Array<{
    date: string;
    completed: boolean;
  }>;
}

interface ExportData {
  exportDate: string;
  version: string;
  user: {
    totalHabits: number;
    averageStrength: number;
  };
  habits: HabitData[];
}

/**
 * Convert habit data to CSV format
 */
export function convertToCSV(data: ExportData): string {
  const headers = [
    'Habit Name',
    'Icon',
    'Strength %',
    'Current Streak',
    'Longest Streak',
    'Created Date',
    'Total Completions',
  ];

  const rows = data.habits.map((habit) => {
    const totalCompletions = habit.completions.filter(
      (c) => c.completed
    ).length;
    return [
      habit.name,
      habit.icon || '',
      Math.round(habit.strength).toString(),
      habit.currentStreak.toString(),
      habit.longestStreak.toString(),
      new Date(habit.createdAt).toLocaleDateString(),
      totalCompletions.toString(),
    ];
  });

  // Build CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Add metadata as comments
  const metadata = [
    `# Export Date: ${data.exportDate}`,
    `# Total Habits: ${data.user.totalHabits}`,
    `# Average Strength: ${Math.round(data.user.averageStrength)}%`,
    '',
  ].join('\n');

  return metadata + csvContent;
}

/**
 * Convert habit data to JSON format
 */
export function convertToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Export data using iOS Share Sheet or Android sharing
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
      // Use expo-sharing for better cross-platform support
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Export Habit Data',
        mimeType,
        UTI:
          format === 'csv'
            ? 'public.comma-separated-values-text'
            : 'public.json',
      });
    } else if (Platform.OS === 'ios') {
      // Fallback to React Native Share for iOS
      await Share.share({
        title: 'Export Habit Data',
        url: fileUri,
      });
    } else {
      // Android fallback
      await Share.share({
        message: content,
        title: 'Export Habit Data',
      });
    }

    // Clean up temporary file after a delay
    setTimeout(() => {
      FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(() => {
        // Ignore cleanup errors
      });
    }, 5000);
  } catch (error) {
    if (error instanceof Error) {
      // User cancelled sharing
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
 * Prepare export data from Convex queries
 */
export async function prepareExportData(
  habits: any[],
  trackings: any[],
  overviewStats: any
): Promise<ExportData> {
  const habitData: HabitData[] = habits.map((habit) => {
    const habitTrackings = trackings.filter((t) => t.habitId === habit._id);

    return {
      completions: habitTrackings.map((t) => ({
        completed: t.completed,
        date: t.date,
      })),

      // Will be calculated from trackings
      createdAt: new Date(habit.createdAt).toISOString(),

      currentStreak: 0,

      icon: habit.icon,

      id: habit._id,

      // Will be calculated from trackings
      longestStreak: 0,

      name: habit.name,

      strength: habit.strength ? habit.strength * 100 : 0,
    };
  });

  // Calculate streaks for each habit
  for (const habit of habitData) {
    const sortedCompletions = habit.completions
      .filter((c) => c.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.date);

      if (lastDate === null) {
        tempStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (completionDate.getTime() - lastDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) {
          tempStreak++;
        } else if (daysDiff > 1) {
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = completionDate;
    }

    // Check if streak is current
    const today = new Date();
    if (lastDate) {
      const daysSinceLastCompletion = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      currentStreak = daysSinceLastCompletion <= 1 ? tempStreak : 0;
    }

    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
  }

  return {
    exportDate: new Date().toISOString(),
    habits: habitData,
    user: {
      averageStrength: overviewStats?.averageStrength || 0,
      totalHabits: overviewStats?.totalHabits || 0,
    },
    version: '1.0.0',
  };
}

/**
 * Show success toast after export
 */
export function showExportSuccess(format: 'csv' | 'json') {
  // This will be handled by the Toast component in the UI
  return {
    duration: 3000,
    message: `Data exported successfully as ${format.toUpperCase()}`,
    type: 'success',
  };
}

/**
 * Show error toast on export failure
 */
export function showExportError(error: Error) {
  return {
    duration: 4000,
    message: `Export failed: ${error.message}`,
    type: 'error',
  };
}
