/**
 * List Habits Query
 * Fetch all active habits for the authenticated user
 */
import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { query } from '../_generated/server';
import { listHabitValidator } from './types';

function projectHabitForList(habit: Doc<'habits'>) {
  return {
    _creationTime: habit._creationTime,
    _id: habit._id,
    archived: habit.archived,
    bestStreak: habit.bestStreak,
    color: habit.color,
    createdAt: habit.createdAt,
    currentStreak: habit.currentStreak,
    daysOfWeek: habit.daysOfWeek,
    effortMinutes: habit.effortMinutes,
    frequency: habit.frequency,
    goalDuration: habit.goalDuration,
    goalUnit: habit.goalUnit,
    growthType: habit.growthType,
    icon: habit.icon,
    iconColor: habit.iconColor,
    lastCompletedDate: habit.lastCompletedDate,
    name: habit.name,
    order: habit.order,
    paused: habit.paused,
    pausedAt: habit.pausedAt,
    preferredTime: habit.preferredTime,
    progressEmojis: habit.progressEmojis,
    remindersEnabled: habit.remindersEnabled,
    reminderSound: habit.reminderSound,
    reminderTime: habit.reminderTime,
    resumedAt: habit.resumedAt,
    strength: habit.strength,
    strengthAlgorithm: habit.strengthAlgorithm,
    strengthLevel: habit.strengthLevel,
    strengthUpdatedAt: habit.strengthUpdatedAt,
    totalCompletions: habit.totalCompletions,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Issue 9: Use by_userId index instead of full table scan with .filter()
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    // Filter out archived habits but include paused habits (they'll be shown differently in UI)
    const activeHabits = habits.filter((h) => h.archived !== true);

    // Sort by order field (ascending), use _creationTime as fallback
    const sortedHabits = activeHabits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a._creationTime - b._creationTime;
    });

    // Issue 4: Use stored strength/strengthLevel from habit documents
    // instead of recalculating from all tracking records on every query.
    // These fields are kept up-to-date by recalculateStreakAndStrength on toggle.
    return sortedHabits.map((habit) => projectHabitForList(habit));
  },
  returns: v.array(listHabitValidator),
});
