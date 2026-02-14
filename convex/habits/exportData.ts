/**
 * Export Habit Data Query
 * Fetch all habit completion history for CSV export
 *
 * Returns habit name, date, completed status, streak, and notes
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { DataExport, dataExportValidator } from './types';

export const getHabitCompletionHistory = query({
  args: {},
  handler: async (ctx): Promise<DataExport[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get all habits for this user
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const exportData: DataExport[] = [];

    // For each habit, get all tracking records and notes
    for (const habit of habits) {
      // Get all tracking records for this habit
      const trackingRecords = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      // Get all notes for this habit
      const notesRecords = await ctx.db
        .query('notes')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();

      // Create a map of date -> note for quick lookup
      const notesByDate = new Map<string, string>();
      for (const note of notesRecords) {
        notesByDate.set(note.date, note.body);
      }

      // Add each tracking record to export data
      for (const record of trackingRecords) {
        exportData.push({
          habitName: habit.name,
          date: record.date,
          completed: record.completed,
          streak: habit.currentStreak ?? 0,
          notes: notesByDate.get(record.date) ?? '',
        });
      }
    }

    // Sort by date (newest first)
    exportData.sort((a, b) => b.date.localeCompare(a.date));

    return exportData;
  },
  returns: v.array(dataExportValidator),
});
