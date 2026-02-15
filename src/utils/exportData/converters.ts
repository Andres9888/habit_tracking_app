/**
 * Data format converters for export
 */

import type { ExportData, FullExportData } from './types';

/**
 * Convert full export data to JSON format
 */
export function convertFullExportToJSON(data: FullExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Convert full export data to CSV format (multi-sheet style with section headers)
 */
export function convertFullExportToCSV(data: FullExportData): string {
  const sections: string[] = [];

  // Metadata
  sections.push(
    `# Chain Day Full Data Export`,
    `# Export Date: ${data.exportDate}`,
    `# Version: ${data.version}`,
    `# Account: ${data.account.email || 'N/A'}`,
    ''
  );

  // Habits
  sections.push('## HABITS');
  sections.push(
    'Name,Icon,Strength %,Current Streak,Best Streak,Total Completions,Frequency,Paused,Archived,Created'
  );
  for (const h of data.habits) {
    sections.push(
      [
        esc(h.name),
        esc(h.icon ?? ''),
        h.strength,
        h.currentStreak,
        h.bestStreak,
        h.totalCompletions,
        esc(h.frequency ?? ''),
        h.paused,
        h.archived,
        h.createdAt,
      ].join(',')
    );
  }
  sections.push('');

  // Tracking
  sections.push('## TRACKING');
  sections.push('Habit ID,Date,Completed');
  for (const t of data.tracking) {
    sections.push([t.habitId, t.date, t.completed].join(','));
  }
  sections.push('');

  // Notes
  if (data.notes.length > 0) {
    sections.push('## NOTES');
    sections.push('Date,Body,Habit ID,Created');
    for (const n of data.notes) {
      sections.push(
        [n.date, esc(n.body), n.habitId ?? '', n.createdAt].join(',')
      );
    }
    sections.push('');
  }

  // Reflections
  if (data.reflections.length > 0) {
    sections.push('## REFLECTIONS');
    sections.push('Date,Emoji,Note,Habit ID,Created');
    for (const r of data.reflections) {
      sections.push(
        [r.date, r.emoji, esc(r.note ?? ''), r.habitId, r.createdAt].join(',')
      );
    }
    sections.push('');
  }

  // Affirmations
  if (data.affirmations.length > 0) {
    sections.push('## AFFIRMATIONS');
    sections.push('Text,Type,Habit ID,Created');
    for (const a of data.affirmations) {
      sections.push(
        [esc(a.text), a.type ?? '', a.habitId, a.createdAt].join(',')
      );
    }
    sections.push('');
  }

  // Letters
  if (data.letters.length > 0) {
    sections.push('## LETTERS TO SELF');
    sections.push('Title,Content,Unlock At,Is Read,Habit ID,Created');
    for (const l of data.letters) {
      sections.push(
        [
          esc(l.title ?? ''),
          esc(l.content),
          l.unlockAt,
          l.isRead,
          l.habitId,
          l.createdAt,
        ].join(',')
      );
    }
    sections.push('');
  }

  // Settings
  if (data.settings) {
    sections.push('## SETTINGS');
    sections.push('Setting,Value');
    for (const [key, value] of Object.entries(data.settings)) {
      if (value !== undefined && value !== null) {
        sections.push([key, String(value)].join(','));
      }
    }
    sections.push('');
  }

  return sections.join('\n');
}

/** Escape a CSV cell value */
function esc(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
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
