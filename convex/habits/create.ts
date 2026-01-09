/**
 * Habit Creation Mutation
 * Creates a new habit with proper ordering and initialization
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { createHabitArgs } from './types';
import { findMaxOrder } from './utils';

export const create = mutation({
  args: createHabitArgs,
  handler: async (ctx, args) => {
    // Get authenticated user (optional for now during auth debugging)
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    console.log('habits.create: identity =', identity ? 'PRESENT' : 'MISSING');
    if (identity) {
      console.log('habits.create: userId =', userId);
    }

    // Get all existing habits for this user to determine next order value
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = findMaxOrder(allHabits);

    return await ctx.db.insert('habits', {
      bestStreak: 0,
      createdAt: Date.now(),
      cueAfterBehavior: args.cueAfterBehavior,
      cueLocation: args.cueLocation,
      cueTime: args.cueTime,
      currentStreak: 0,
      icon: args.icon,
      iconColor: args.iconColor,
      lastCompletedDate: undefined,
      name: args.name,
      userId,
      notes: args.notes,
      order: maxOrder + 1,
      preferredTime: args.preferredTime,
      remindersEnabled: args.remindersEnabled,
      reminderSound: args.reminderSound,
      reminderTime: args.reminderTime,
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
    });
  },
  returns: v.id('habits'),
});
