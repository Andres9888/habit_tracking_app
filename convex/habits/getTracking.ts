/**
 * Get Tracking Data Query
 * Fetch tracking records for a set of dates
 *
 * Uses the by_user_and_date index to avoid table scans and fan-out queries.
 * For legacy rows missing tracking.userId, run migration:backfillTrackingUserId.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { trackingRecordValidator } from './types';

export const getTracking = query({
  args: {
    dates: v.optional(v.array(v.string())),
    endDate: v.optional(v.string()),
    startDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let startDate: string | undefined;
    let endDate: string | undefined;
    let dateSet: Set<string> | null = null;

    if (args.startDate && args.endDate) {
      const isAscending = args.startDate <= args.endDate;
      startDate = isAscending ? args.startDate : args.endDate;
      endDate = isAscending ? args.endDate : args.startDate;
    } else if (args.dates && args.dates.length > 0) {
      const sortedDates = [...args.dates].sort();
      startDate = sortedDates[0];
      endDate = sortedDates.at(-1);
      dateSet = new Set(args.dates);
    } else {
      return [];
    }

    if (!startDate || !endDate) return [];

    const trackingInRange = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q
          .eq('userId', identity.subject)
          .gte('date', startDate)
          .lte('date', endDate)
      )
      .collect();

    if (dateSet) {
      return trackingInRange.filter((entry) => dateSet.has(entry.date));
    }
    return trackingInRange;
  },
  returns: v.array(trackingRecordValidator),
});
