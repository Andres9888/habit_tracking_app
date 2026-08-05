import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';
import { internalMutation } from './_generated/server';
import {
  claimStorageForUser,
  getStorageOwner,
  releaseStorageForUser,
} from './storageOwnership';
import { UNCLAIMED_UPLOAD_RETENTION_MS } from './storageValidation';

export const purgeExpiredDeletedHabits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query('deletedHabits')
      .withIndex('by_expiresAt', (q) => q.lt('expiresAt', now))
      .take(500);
    for (const row of expired) {
      await ctx.db.delete(row._id);
    }
    return { deleted: expired.length };
  },
});

export const purgeUnclaimedUploads = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - UNCLAIMED_UPLOAD_RETENTION_MS;
    const staleFiles = await ctx.db.system
      .query('_storage')
      .filter((q) => q.lt(q.field('_creationTime'), cutoff))
      .take(500);

    let backfilled = 0;
    let deleted = 0;
    for (const file of staleFiles) {
      const owner = await getStorageOwner(ctx, file._id);
      const attachedUser = await ctx.db
        .query('users')
        .withIndex('by_profile_image_storage_id', (q) =>
          q.eq('profileImageStorageId', file._id)
        )
        .first();
      if (attachedUser?.clerkId) {
        if (!owner) {
          await claimStorageForUser(ctx, file._id, attachedUser.clerkId);
          backfilled += 1;
        }
        continue;
      }

      try {
        await ctx.storage.delete(file._id);
        if (owner) {
          await releaseStorageForUser(ctx, file._id, owner.userId);
        }
        deleted += 1;
      } catch {
        // Retry transient storage failures on the next sweep.
      }
    }

    return { backfilled, deleted, scanned: staleFiles.length };
  },
});

const crons = cronJobs();

crons.daily(
  'purge expired deletedHabits',
  { hourUTC: 7, minuteUTC: 0 },
  internal.crons.purgeExpiredDeletedHabits
);

crons.daily(
  'purge unclaimed uploads',
  { hourUTC: 6, minuteUTC: 30 },
  internal.crons.purgeUnclaimedUploads
);

crons.interval(
  'recompute template popularity',
  { hours: 2 },
  internal.templates.popularity.recompute
);

crons.daily(
  'recalculate stale habit strength',
  { hourUTC: 8, minuteUTC: 0 },
  internal.habits.recalculateStaleStrength.recalculateStaleStrength,
  {}
);

export default crons;
