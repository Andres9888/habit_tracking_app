/**
 * Data format converters for export
 */

import type { ExportData } from './types';

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
