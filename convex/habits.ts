import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: { 
    name: v.string(),
    notes: v.optional(v.string())
  },
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
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.habitId, {
      notes: args.notes
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const toggleHabit = mutation({
  args: { habitId: v.id("habits"), date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

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
  },
});

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const tracking = [];
    for (const date of args.dates) {
      const dayTracking = await ctx.db
        .query("tracking")
        .withIndex("by_user_and_date", (q) =>
          q.eq("userId", userId).eq("date", date)
        )
        .collect();
      tracking.push(...dayTracking);
    }
    return tracking;
  },
});

export const getStats = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { streak: 0, consistency: 0 };

    const tracking = await ctx.db
      .query("tracking")
      .withIndex("by_habit_and_date", (q) => q.eq("habitId", args.habitId))
      .collect();

    const sortedDates = tracking
      .filter(t => t.completed)
      .map(t => new Date(t.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayTime = now.getTime();
    
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
    const recentTracking = tracking.filter(t => {
      const date = new Date(t.date);
      return date >= thirtyDaysAgo && t.completed;
    });
    
    const consistency = Math.round((recentTracking.length / 30) * 100);

    return { streak, consistency };
  },
});
