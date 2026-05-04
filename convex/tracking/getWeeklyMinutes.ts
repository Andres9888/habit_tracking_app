import { v } from 'convex/values';
import { query } from '../_generated/server';
import { DATE_FORMAT_REGEX } from './helpers';

function addDaysISO(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getWeeklyMinutes = query({
  args: {
    habitId: v.id('habits'),
    weekStartDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view weekly minutes');
    }
    if (!DATE_FORMAT_REGEX.test(args.weekStartDate)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view weekly minutes for this habit');
    }

    const weekEndDate = addDaysISO(args.weekStartDate, 6);
    const records = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q
          .eq('habitId', args.habitId)
          .gte('date', args.weekStartDate)
          .lte('date', weekEndDate)
      )
      .collect();

    const byDate: Record<string, number> = {};
    let totalMinutes = 0;
    for (const record of records) {
      if (record.minutes && record.minutes > 0) {
        byDate[record.date] = record.minutes;
        totalMinutes += record.minutes;
      }
    }

    return { byDate, totalMinutes };
  },
  returns: v.object({
    byDate: v.record(v.string(), v.number()),
    totalMinutes: v.number(),
  }),
});
