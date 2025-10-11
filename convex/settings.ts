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
    // Get first settings record (since auth was removed, just use any settings)
    const settings = await ctx.db.query("userSettings").first();

    // Only return the whitelisted fields to satisfy the returns validator
    return {
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: settings?.darkMode ?? DEFAULT_SETTINGS.darkMode,
      showCalendarView:
        settings?.showCalendarView ?? DEFAULT_SETTINGS.showCalendarView,
      showConsistency:
        settings?.showConsistency ?? DEFAULT_SETTINGS.showConsistency,
      showEmojis: settings?.showEmojis ?? DEFAULT_SETTINGS.showEmojis,
      showMotivationalMessages:
        settings?.showMotivationalMessages ??
        DEFAULT_SETTINGS.showMotivationalMessages,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
    };
  },
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
    // Get first settings record (since auth was removed, just use any settings)
    const existing = await ctx.db.query("userSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("userSettings", args);
    }
    return null;
  },
});
