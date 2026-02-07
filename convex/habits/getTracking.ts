/**
 * Get Tracking Data Query
 * Fetch tracking records for a date range (startDate..endDate inclusive)
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { trackingRecordValidator } from './types';

export const getTracking = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return ctx.db
      .query('tracking')
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), identity.subject),
          q.gte(q.field('date'), args.startDate),
          q.lte(q.field('date'), args.endDate)
        )
      )
      .collect();
  },
  returns: v.array(trackingRecordValidator),
});
