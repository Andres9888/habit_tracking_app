import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    notes: v.optional(v.string())
  },
  returns: v.id("habits"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("habits", {
      userId,
      name: args.name,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});

export const updateNotes = mutation({
  args: {
    habitId: v.id("habits"),
    notes: v.string()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.habitId, {
      notes: args.notes
    });
    return null;
  },
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("habits"),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.id("users"),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("habits")
      .withIndex("by_user_and_name", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const toggleHabit = mutation({
  args: { habitId: v.id("habits"), date: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate date format as YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);
    if (!isValidDate) throw new Error("Invalid date format; expected YYYY-MM-DD");

    const existing = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: !existing.completed,
      });
    } else {
      await ctx.db.insert("tracking", {
        habitId: args.habitId,
        userId,
        date: args.date,
        completed: true,
      });
    }
    return null;
  },
});

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("tracking"),
      completed: v.boolean(),
      date: v.string(),
      habitId: v.id("habits"),
      userId: v.id("users"),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (args.dates.length === 0) return [];

    // Optimize by querying a single date range then filtering to requested dates
    const sortedDates = [...args.dates].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    const range = await ctx.db
      .query("tracking")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).gte("date", startDate).lte("date", endDate)
      )
      .collect();

    const dateSet = new Set(args.dates);
    return range.filter((t) => dateSet.has(t.date));
  },
});

export const getStats = query({
  args: { habitId: v.id("habits") },
  returns: v.object({ streak: v.number(), consistency: v.number() }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { streak: 0, consistency: 0 };

    const tracking = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) => q.eq("habitId", args.habitId))
      .collect();

    const sortedDates = tracking
      .filter((t) => t.completed)
      .map((t) => new Date(t.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(now);
      expectedDate.setDate(now.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      const expectedTime = expectedDate.getTime();

      if (sortedDates[i] === expectedTime) {
        streak++;
      } else {
        break;
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const recentTracking = tracking.filter((t) => {
      const date = new Date(t.date);
      return date >= thirtyDaysAgo && t.completed;
    });

    const consistency = Math.max(0, Math.min(100, Math.round((recentTracking.length / 30) * 100)));

    return { streak, consistency };
  },
});
