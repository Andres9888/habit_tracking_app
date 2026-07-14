import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';
import { internalMutation } from './_generated/server';

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

export const purgeExpiredProductEvents = internalMutation({
  args: {},
  handler: async (ctx) => {
    const expired = await ctx.db
      .query('productEvents')
      .withIndex('by_expires_at', (q) => q.lt('expiresAt', Date.now()))
      .take(500);
    for (const row of expired) await ctx.db.delete(row._id);
    return { deleted: expired.length };
  },
});

const crons = cronJobs();

crons.daily(
  'purge expired deletedHabits',
  { hourUTC: 7, minuteUTC: 0 },
  internal.crons.purgeExpiredDeletedHabits
);

crons.interval(
  'purge expired product events',
  { hours: 1 },
  internal.crons.purgeExpiredProductEvents
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
