/**
 * Habit Creation Mutation
 * Creates a new habit with proper ordering and initialization
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { MAX_HABITS_PER_USER, RATE_LIMITS, rateLimit } from '../lib/rateLimiter';
import { createHabitArgs } from './types';
import { findMaxOrder } from './utils';
import { validateHabitFields } from './validation';

export const create = mutation({
  args: createHabitArgs,
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create habits');
    }
    const userId = identity.subject;

    // SEC-004: Rate limiting
    await rateLimit(ctx.db, userId, RATE_LIMITS.habitCreate);

    // SEC-003: Input validation
    const validated = validateHabitFields(args);

    // Get all existing habits for this user to determine next order value
    const allHabits = await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    // SEC-004: Hard limit on habits per user
    if (allHabits.length >= MAX_HABITS_PER_USER) {
      throw new Error(
        `Habit limit reached: you can have at most ${MAX_HABITS_PER_USER} habits. ` +
        'Please delete some habits before creating new ones.'
      );
    }

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
      notes: validated.notes,
      order: maxOrder + 1,
      preferredTime: validated.preferredTime,
      remindersEnabled: args.remindersEnabled,
      reminderSound: validated.reminderSound,
      reminderTime: validated.reminderTime,
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
      userId,
    });
  },
  returns: v.id('habits'),
});
