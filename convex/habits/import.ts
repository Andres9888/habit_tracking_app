/**
 * Habit Import Mutation
 * Batch imports habits from CSV (Streaks, Habitica, generic)
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { findMaxOrder } from './utils';

const importedHabitSchema = v.object({
  color: v.optional(v.string()),
  completionHistory: v.optional(
    v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    )
  ),
  frequency: v.optional(v.string()),
  icon: v.optional(v.string()),
  name: v.string(),
  notes: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
});

export const importHabits = mutation({
  args: {
    habits: v.array(importedHabitSchema),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to import habits');
    }
    const userId = identity.subject;

    // Get existing habits to determine starting order
    const allHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    let maxOrder = findMaxOrder(allHabits);

    const createdHabits: string[] = [];
    const now = Date.now();

    // Create habits in batch
    for (const habit of args.habits) {
      maxOrder += 1;

      const habitId = await ctx.db.insert('habits', {
        archived: false,
        bestStreak: 0,
        color: habit.color || '#047857',
        createdAt: now,
        currentStreak: 0,
        icon: habit.icon || '⭐',
        iconColor: habit.color || '#047857',
        name: habit.name,
        notes: habit.notes,
        order: maxOrder,
        strength: 0,
        strengthLevel: 'starting',
        strengthUpdatedAt: now,
        totalCompletions: 0,
        totalMisses: 0,
        userId,
      });

      createdHabits.push(habitId);

      // If completion history is provided, import it
      if (habit.completionHistory && habit.completionHistory.length > 0) {
        for (const entry of habit.completionHistory) {
          await ctx.db.insert('tracking', {
            completed: entry.completed,
            date: entry.date,
            habitId,
            userId,
          });
        }
      }
    }

    return {
      count: createdHabits.length,
      habitIds: createdHabits,
    };
  },
  returns: v.object({
    count: v.number(),
    habitIds: v.array(v.string()),
  }),
});
