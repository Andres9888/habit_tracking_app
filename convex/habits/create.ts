/**
 * Habit Creation Mutation
 * Creates a new habit with proper ordering and initialization
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { createHabitArgs } from './types';
import { findMaxOrder } from './utils';
import { validateHabitFields } from './validation';

export const create = mutation({
  args: createHabitArgs,
  handler: async (ctx, args) => {
    // Get authenticated user (optional for now during auth debugging)
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    // SEC-003: Input validation
    const validated = validateHabitFields(args);

    // Get all existing habits for this user to determine next order value
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = findMaxOrder(allHabits);

    return await ctx.db.insert('habits', {
      bestStreak: 0,
      createdAt: Date.now(),
      cueAfterBehavior: validated.cueAfterBehavior,
      cueLocation: validated.cueLocation,
      cueTime: validated.cueTime,
      currentStreak: 0,
      icon: validated.icon,
      iconColor: validated.iconColor,
      lastCompletedDate: undefined,
      name: validated.name,
      userId,
      notes: validated.notes,
      order: maxOrder + 1,
      preferredTime: validated.preferredTime,
      remindersEnabled: args.remindersEnabled,
      reminderSound: validated.reminderSound,
      reminderTime: validated.reminderTime,
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
    });
  },
  returns: v.id('habits'),
});
