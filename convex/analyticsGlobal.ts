/**
 * Global Analytics for Social Proof
 * Provides aggregate stats across all users for retention features
 */

import { query } from './_generated/server';
import { getToday } from './lib/dateHelpers';

/**
 * Get global statistics for social proof display
 * Returns today's aggregate data across all users
 */
export const getGlobalStats = query({
  args: {},
  handler: async (ctx) => {
    // Get today's date string for filtering
    const today = getToday();

    // Count total completions today
    // Note: This is a simplified version. In production, you'd want to:
    // 1. Add an index on (dateString, status)
    // 2. Potentially cache this with a cron job
    // 3. Add rate limiting
    
    const allTrackingRecords = await ctx.db
      .query('tracking')
      .filter((q) => q.eq(q.field('dateString'), today))
      .collect();

    const completionsToday = allTrackingRecords.filter(
      (record) => record.status === 'completed'
    ).length;

    // Count active users (users who completed at least one habit today)
    const activeUserIds = new Set(
      allTrackingRecords
        .filter((record) => record.status === 'completed')
        .map((record) => record.userId)
    );

    return {
      activeUsers: activeUserIds.size,
      completionsToday,
    };
  },
});
