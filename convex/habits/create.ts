/**
 * Habit Creation Mutation
 * Creates a new habit with proper ordering and initialization
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { createHabitArgs } from './types';
import { findMaxOrder } from './utils';
import { validateHabitFields } from './validation';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';
import { enforceRateLimit } from '../lib/rateLimit';

const FREE_HABIT_LIMIT = 3;

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

    // Get all existing habits for this user to determine next order value
    const allHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    // SEC-005: Free tier limit — only count active (non-archived, non-removed, non-paused) habits.
    // Paused habits are excluded so users can temporarily pause all 3 and still create new ones.
    const activeHabits = allHabits.filter((h) => !h.archived && !h.paused);
    const isPremiumUser = await hasPremiumAccess(ctx, userId);
    if (!isPremiumUser && activeHabits.length >= FREE_HABIT_LIMIT) {
      throw new Error(
        `Free tier is limited to ${FREE_HABIT_LIMIT} habits. Upgrade to premium for unlimited habits.`
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
      daysOfWeek: args.daysOfWeek,
      frequency: args.frequency,
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
