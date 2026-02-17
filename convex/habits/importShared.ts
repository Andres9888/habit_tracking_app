/**
 * Import Shared Habit
 * Creates a new habit from shared data
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

const importSharedHabitArgs = {
  name: v.string(),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  notes: v.optional(v.string()),
  frequency: v.optional(v.string()),
  daysOfWeek: v.optional(v.array(v.number())),
  preferredTime: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  goalUnit: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueAfterBehavior: v.optional(v.string()),
  why: v.optional(v.string()),
  identity: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  vizSuccessBody: v.optional(v.string()),
  vizSuccessEmotion: v.optional(v.string()),
  vizSuccessMind: v.optional(v.string()),
  vizFailureBody: v.optional(v.string()),
  vizFailureEmotion: v.optional(v.string()),
  vizFailureMind: v.optional(v.string()),
  woopWish: v.optional(v.string()),
  woopOutcome: v.optional(v.string()),
  woopObstacle: v.optional(v.string()),
  woopPlan: v.optional(v.string()),
};

/**
 * Import a shared habit into the current user's habit list
 */
export const importShared = mutation({
  args: importSharedHabitArgs,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Get the current max order for this user's habits
    const existingHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('archived'), false))
      .collect();

    const maxOrder = existingHabits.reduce(
      (max, h) => Math.max(max, h.order ?? 0),
      -1
    );

    // Create the habit with default values and shared data
    const habitId = await ctx.db.insert('habits', {
      ...args,
      userId,
      createdAt: Date.now(),
      order: maxOrder + 1,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      totalMisses: 0,
      strength: 0.1,
      accessibility: 0.1,
      strengthLevel: 'forming',
      archived: false,
      paused: false,
    });

    return habitId;
  },
});
