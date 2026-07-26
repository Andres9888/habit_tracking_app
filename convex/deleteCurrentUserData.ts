import type { MutationCtx } from './_generated/server';
import { deleteUserStorage } from './deleteUserStorage';

async function deleteDocuments(
  ctx: MutationCtx,
  ids: Array<Parameters<MutationCtx['db']['delete']>[0]>
): Promise<number> {
  for (const id of ids) await ctx.db.delete(id);
  return ids.length;
}

export async function deleteCurrentUserDataHandler(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  const userId = identity.subject;
  const habits = await ctx.db
    .query('habits')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .collect();
  const tracking = await ctx.db
    .query('tracking')
    .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
    .collect();
  const settings = await ctx.db
    .query('userSettings')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .collect();
  const subscriptions = await ctx.db
    .query('subscriptions')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
    .collect();
  const users = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
    .collect();
  const ownedStorage = await ctx.db
    .query('storageOwnership')
    .withIndex('by_user_id', (q) => q.eq('userId', userId))
    .collect();
  const deletedHabits = await ctx.db
    .query('deletedHabits')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .collect();
  const templateUsage = await ctx.db
    .query('templateUsage')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .collect();
  const rateLimits = await ctx.db
    .query('rateLimits')
    .withIndex('by_user_and_action', (q) => q.eq('userId', userId))
    .collect();
  const deletedTemplateUsage = await deleteDocuments(
    ctx,
    templateUsage.map((entry) => entry._id)
  );
  const deletedRateLimits = await deleteDocuments(
    ctx,
    rateLimits.map((entry) => entry._id)
  );
  const deletedTracking = await deleteDocuments(
    ctx,
    tracking.map((entry) => entry._id)
  );
  const deletedHabitsCount = await deleteDocuments(
    ctx,
    habits.map((entry) => entry._id)
  );
  const deletedSettings = await deleteDocuments(
    ctx,
    settings.map((entry) => entry._id)
  );
  const deletedSubscriptions = await deleteDocuments(
    ctx,
    subscriptions.map((entry) => entry._id)
  );
  const deletedUsers = await deleteDocuments(
    ctx,
    users.map((entry) => entry._id)
  );
  const deletedUndoRecords = await deleteDocuments(
    ctx,
    deletedHabits.map((entry) => entry._id)
  );
  await deleteUserStorage(ctx, users, ownedStorage);
  return {
    deletedHabits: deletedHabitsCount,
    deletedRateLimits,
    deletedSettings,
    deletedSubscriptions,
    deletedTemplateUsage,
    deletedTracking,
    deletedUndoRecords,
    deletedUsers,
  };
}
