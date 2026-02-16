/**
 * Data Export Utility
 * Exports user habit data in CSV and JSON formats
 * Privacy-safe: excludes auth tokens, internal IDs, and sensitive data
 */

interface HabitData {
  name: string;
  icon?: string;
  color?: string;
  createdAt: number;
  archived?: boolean;
  currentStreak?: number;
  bestStreak?: number;
  totalCompletions?: number;
  strength?: number;
  strengthLevel?: string;
  frequency?: string;
  why?: string;
  identity?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
}

interface TrackingData {
  habitId: string;
  date: string;
  completed: boolean;
}

interface ExportData {
  habits: HabitData[];
  tracking: TrackingData[];
  exportedAt: string;
  version: string;
}

/**
 * Converts habit data to CSV format
 * Includes: habit name, dates, completion status
 */
export function generateCSV(habits: HabitData[], tracking: TrackingData[]): string {
  // Create a map for quick habit lookups
  const habitMap = new Map(
    habits.map((h, idx) => [idx.toString(), h])
  );

  // Create a tracking map: habitName -> date -> completed
  const trackingByHabit = new Map<string, Map<string, boolean>>();
  
  tracking.forEach((t) => {
    const habit = habits.find((h, idx) => idx.toString() === t.habitId);
    if (!habit) return;
    
    if (!trackingByHabit.has(habit.name)) {
      trackingByHabit.set(habit.name, new Map());
    }
    trackingByHabit.get(habit.name)!.set(t.date, t.completed);
  });

  // Get all unique dates, sorted
  const allDates = Array.from(
    new Set(tracking.map((t) => t.date))
  ).sort();

  // Build CSV header
  const headers = ['Habit Name', ...allDates];
  let csv = headers.join(',') + '\n';

  // Build CSV rows
  habits.forEach((habit) => {
    const row = [
      `"${habit.name.replace(/"/g, '""')}"`, // Escape quotes in habit name
      ...allDates.map((date) => {
        const habitTracking = trackingByHabit.get(habit.name);
        const completed = habitTracking?.get(date) ?? false;
        return completed ? '✓' : '';
      }),
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

/**
 * Generates JSON export with full data
 * Includes: habits, completions, streaks, strength metrics
 * Privacy-safe: no auth tokens, user IDs, or internal database IDs
 */
export function generateJSON(habits: HabitData[], tracking: TrackingData[]): string {
  const exportData: ExportData = {
    exportedAt: new Date().toISOString(),
    habits: habits.map((habit, idx) => ({
      archived: habit.archived ?? false,
      bestStreak: habit.bestStreak ?? 0,
      color: habit.color,
      createdAt: habit.createdAt,
      cueAfterBehavior: habit.cueAfterBehavior,
      cueLocation: habit.cueLocation,
      cueTime: habit.cueTime,
      currentStreak: habit.currentStreak ?? 0,
      frequency: habit.frequency ?? 'daily',
      icon: habit.icon,
      identity: habit.identity,
      name: habit.name,
      strength: habit.strength,
      strengthLevel: habit.strengthLevel,
      totalCompletions: habit.totalCompletions ?? 0,
      why: habit.why,
    })),
    tracking: tracking.map((t) => {
      const habit = habits.find((h, idx) => idx.toString() === t.habitId);
      return {
        completed: t.completed,
        date: t.date,
        habitName: habit?.name ?? 'Unknown',
      };
    }),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Format timestamp for filename (YYYY-MM-DD_HH-MM)
 */
export function getExportFilename(format: 'csv' | 'json'): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now
    .toTimeString()
    .split(' ')[0]
    .replace(/:/g, '-')
    .substring(0, 5); // HH-MM
  return `chain-day-export_${dateStr}_${timeStr}.${format}`;
}
