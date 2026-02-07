/**
 * Get Tracking Data Query
 * Fetch tracking records for a set of dates
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { trackingRecordValidator } from './types';

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    if (args.dates.length === 0) return [];

    const sortedDates = [...args.dates].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates.at(-1);
    if (!endDate) return [];

    const range = await ctx.db
      .query('tracking')
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), identity.subject),
          q.gte(q.field('date'), startDate),
          q.lte(q.field('date'), endDate)
        )
      )
      .collect();

    const dateSet = new Set(args.dates);
    return range.filter((t) => dateSet.has(t.date));
  },
  returns: v.array(trackingRecordValidator),
});
