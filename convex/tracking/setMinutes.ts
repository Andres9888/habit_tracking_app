import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { DATE_FORMAT_REGEX } from './helpers';

const MAX_MINUTES_PER_DAY = 1440;

export const setHabitMinutes = mutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
    minutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to log minutes');
    }
    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    if (
      args.minutes !== undefined &&
      (!Number.isFinite(args.minutes) ||
        args.minutes < 0 ||
        args.minutes > MAX_MINUTES_PER_DAY)
    ) {
      throw new Error(
        `Invalid minutes: must be between 0 and ${MAX_MINUTES_PER_DAY}`
      );
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to log minutes for this habit');
    }

    const normalizedMinutes =
      args.minutes === undefined || args.minutes === 0 ? undefined : args.minutes;

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    await (existing
      ? ctx.db.patch(existing._id, {
          minutes: normalizedMinutes,
          ...(existing.userId ? {} : { userId: identity.subject }),
        })
      : ctx.db.insert('tracking', {
          completed: false,
          date: args.date,
          habitId: args.habitId,
          minutes: normalizedMinutes,
          userId: identity.subject,
        }));

    return null;
  },
  returns: v.null(),
});
