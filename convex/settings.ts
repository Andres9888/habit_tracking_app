import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const DARK_MODE_OPTIONS = ['system', 'light', 'dark'] as const;
type DarkModePreference = (typeof DARK_MODE_OPTIONS)[number];

const DEFAULT_SETTINGS = {
  catTheme: true,
  darkMode: 'system' as DarkModePreference,
  showCalendarView: true,
  showCharacterScreen: true,
  showConsistency: true,
  showEmojis: true,
  showMotivationalMessages: true,
  showNotesStats: true,
  showStreaks: true,
  // New settings from Figma design
  appIcon: 'default' as const,
  highContrastMode: false,
  reduceMotion: false,
  useDyslexicFont: false,
};

const normalizeDarkMode = (value: unknown): DarkModePreference => {
  if (value === 'dark' || value === 'light' || value === 'system') {
    return value;
  }

  if (value === true) {
    return 'dark';
  }

  if (value === false) {
    return 'light';
  }

  return DEFAULT_SETTINGS.darkMode;
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get first settings record (since auth was removed, just use any settings)
    const settings = await ctx.db.query('userSettings').first();

    // Only return the whitelisted fields to satisfy the returns validator
    return {
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: normalizeDarkMode(settings?.darkMode),
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
      highContrastMode:
        settings?.highContrastMode ?? DEFAULT_SETTINGS.highContrastMode,
      reduceMotion:
        settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
      useDyslexicFont:
        settings?.useDyslexicFont ?? DEFAULT_SETTINGS.useDyslexicFont,
    };
  },
  returns: v.object({
    catTheme: v.boolean(),
    darkMode: v.union(
      v.literal('system'),
      v.literal('light'),
      v.literal('dark'),
    ),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.boolean(),
    showStreaks: v.boolean(),
    appIcon: v.string(),
    highContrastMode: v.boolean(),
    reduceMotion: v.boolean(),
    useDyslexicFont: v.boolean(),
  }),
});

export const update = mutation({
  args: {
    catTheme: v.boolean(),
    darkMode: v.union(
      v.literal('system'),
      v.literal('light'),
      v.literal('dark'),
    ),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.optional(v.boolean()),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.optional(v.boolean()),
    showStreaks: v.boolean(),
    appIcon: v.optional(v.string()),
    highContrastMode: v.optional(v.boolean()),
    reduceMotion: v.optional(v.boolean()),
    useDyslexicFont: v.optional(v.boolean()),
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
