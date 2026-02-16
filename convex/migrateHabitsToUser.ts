import { internalMutation } from './_generated/server';

/**
 * One-time migration to add userId to existing habits
 * Run this once after adding authentication
 */
export const migrateHabitsToCurrentUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be authenticated to run migration');
    }

    // Get all habits without a userId
    const habitsWithoutUser = await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('userId'), undefined))
      .collect();

    // Migrating habits without userId

    // Update each habit to belong to current user
    for (const habit of habitsWithoutUser) {
      await ctx.db.patch(habit._id, {
        userId: identity.subject,
      });
    }

    return {
      migrated: habitsWithoutUser.length,
      userId: identity.subject,
    };
  },
});
