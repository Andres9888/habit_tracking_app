import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const DEFAULT_SETTINGS = {
  catTheme: true,
  darkMode: false,
  showCalendarView: true,
  showCharacterScreen: true,
  showConsistency: true,
  showEmojis: true,
  showMotivationalMessages: true,
  showNotesStats: true,
  showStreaks: true,
  // New settings from Figma design
  appIcon: 'default' as const,
  textSize: 'medium' as const,
  highContrastMode: false,
  reduceMotion: false,
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get first settings record (since auth was removed, just use any settings)
    const settings = await ctx.db.query('userSettings').first();

    // Only return the whitelisted fields to satisfy the returns validator
    return {
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: settings?.darkMode ?? DEFAULT_SETTINGS.darkMode,
      showCalendarView:
        settings?.showCalendarView ?? DEFAULT_SETTINGS.showCalendarView,
      showCharacterScreen:
        settings?.showCharacterScreen ?? DEFAULT_SETTINGS.showCharacterScreen,
      showConsistency:
        settings?.showConsistency ?? DEFAULT_SETTINGS.showConsistency,
      showEmojis: settings?.showEmojis ?? DEFAULT_SETTINGS.showEmojis,
      showMotivationalMessages:
        settings?.showMotivationalMessages ??
        DEFAULT_SETTINGS.showMotivationalMessages,
      showNotesStats:
        settings?.showNotesStats ?? DEFAULT_SETTINGS.showNotesStats,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
      appIcon: settings?.appIcon ?? DEFAULT_SETTINGS.appIcon,
      textSize: settings?.textSize ?? DEFAULT_SETTINGS.textSize,
      highContrastMode:
        settings?.highContrastMode ?? DEFAULT_SETTINGS.highContrastMode,
      reduceMotion:
        settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
    };
  },
  returns: v.object({
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.boolean(),
    showStreaks: v.boolean(),
    appIcon: v.string(),
    textSize: v.string(),
    highContrastMode: v.boolean(),
    reduceMotion: v.boolean(),
  }),
});

export const update = mutation({
  args: {
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.optional(v.boolean()),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.optional(v.boolean()),
    showStreaks: v.boolean(),
    appIcon: v.optional(v.string()),
    textSize: v.optional(v.string()),
    highContrastMode: v.optional(v.boolean()),
    reduceMotion: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get first settings record (since auth was removed, just use any settings)
    const existing = await ctx.db.query('userSettings').first();

    await (existing
      ? ctx.db.patch(existing._id, args)
      : ctx.db.insert('userSettings', args));
    return null;
  },
  returns: v.null(),
});
