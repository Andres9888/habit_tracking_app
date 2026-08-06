/**
 * Habit Creation Mutation
 * Creates a new habit with proper ordering and initialization
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { createHabitArgs } from './types';
import { findMaxOrderForUser } from './utils';
import { validateDaysOfWeek, validateHabitFields } from './validation';
import { enforceRateLimit } from '../lib/rateLimit';

export const create = mutation({
  args: createHabitArgs,
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create habits');
    }
    const userId = identity.subject;

    // SR-2026-04-17-09: throttle per-user habit creation.
    await enforceRateLimit(ctx, userId, 'habit.create');

    // SEC-003: Input validation
    const validated = validateHabitFields(args);
    validateDaysOfWeek(args.daysOfWeek);

    // Single indexed read — no need to load every habit document just to take
    // the maximum order.
    const maxOrder = await findMaxOrderForUser(ctx, userId);

    return await ctx.db.insert('habits', {
      bestStreak: 0,
      createdAt: Date.now(),
      cueAfterBehavior: validated.cueAfterBehavior,
      cueLocation: validated.cueLocation,
      cueTime: validated.cueTime,
      currentStreak: 0,
      daysOfWeek: args.daysOfWeek,
      frequency: args.frequency,
      goalDuration: args.goalDuration,
      icon: validated.icon,
      color: validated.color,
      iconColor: validated.iconColor ?? validated.color,
      lastCompletedDate: undefined,
      name: validated.name,
      notes: validated.notes,
      order: maxOrder + 1,
      preferredTime: validated.preferredTime,
      progressEmojis: args.progressEmojis,
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
