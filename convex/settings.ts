import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const DEFAULT_SETTINGS = {
  showStreaks: true,
  showConsistency: true,
  showMotivationalMessages: true,
  showEmojis: true,
  showCalendarView: true,
  catTheme: true,
};

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return DEFAULT_SETTINGS;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    return settings ?? DEFAULT_SETTINGS;
  }
});

export const update = mutation({
  args: {
    showStreaks: v.boolean(),
    showConsistency: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showEmojis: v.boolean(),
    showCalendarView: v.boolean(),
    catTheme: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("userSettings", {
        userId,
        ...args,
      });
    }
  }
});
