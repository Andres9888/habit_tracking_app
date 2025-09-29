import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_SETTINGS = {
  showStreaks: true,
  showConsistency: true,
  showMotivationalMessages: true,
  showEmojis: true,
  showCalendarView: true,
  catTheme: true,
  darkMode: false,
};

export const get = query({
  args: {},
  returns: v.object({
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showStreaks: v.boolean(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return DEFAULT_SETTINGS;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();

    // Only return the whitelisted fields to satisfy the returns validator
    return {
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: settings?.darkMode ?? DEFAULT_SETTINGS.darkMode,
      showCalendarView: settings?.showCalendarView ?? DEFAULT_SETTINGS.showCalendarView,
      showConsistency: settings?.showConsistency ?? DEFAULT_SETTINGS.showConsistency,
      showEmojis: settings?.showEmojis ?? DEFAULT_SETTINGS.showEmojis,
      showMotivationalMessages: settings?.showMotivationalMessages ?? DEFAULT_SETTINGS.showMotivationalMessages,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
    };
  }
});

export const update = mutation({
  args: {
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showStreaks: v.boolean(),
  },
  returns: v.null(),
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
    return null;
  }
});
