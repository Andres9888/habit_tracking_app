/**
 * Get Tracking Data Query
 * Fetch tracking records for a set of dates
 *
 * Uses the by_user_and_date index to avoid full table scans.
 * Previously used .filter() which scanned every row in the tracking table.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { trackingRecordValidator } from './types';

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.dates.length === 0) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const sortedDates = [...args.dates].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates.at(-1);
    if (!endDate) return [];

    const range = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q
          .eq('userId', identity.subject)
          .gte('date', startDate)
          .lte('date', endDate)
      )
      .collect();

    const dateSet = new Set(args.dates);
    return range.filter((t) => dateSet.has(t.date));
  },
  returns: v.array(trackingRecordValidator),
});
