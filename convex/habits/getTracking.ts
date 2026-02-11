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
  args: {
    // Legacy: full array of date strings (kept for backward compat)
    dates: v.optional(v.array(v.string())),
    // Preferred: date range as two strings (much smaller payload)
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let start: string | undefined;
    let end: string | undefined;
    let dateSet: Set<string> | null = null;

    if (args.startDate && args.endDate) {
      // New path: use range directly
      start = args.startDate;
      end = args.endDate;
    } else if (args.dates && args.dates.length > 0) {
      // Legacy path: extract range from array
      const sortedDates = [...args.dates].sort();
      start = sortedDates[0];
      end = sortedDates.at(-1);
      // Only filter by set if dates might be non-contiguous
      dateSet = new Set(args.dates);
    } else {
      return [];
    }

    if (!start || !end) return [];

    const range = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q
          .eq('userId', identity.subject)
          .gte('date', start!)
          .lte('date', end!)
      )
      .collect();

    // If using legacy dates array, filter to exact dates
    if (dateSet) {
      return range.filter((t) => dateSet!.has(t.date));
    }
    return range;
  },
  returns: v.array(trackingRecordValidator),
});
