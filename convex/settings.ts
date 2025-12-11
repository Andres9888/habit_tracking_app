import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const DARK_MODE_OPTIONS = ['system', 'light', 'dark'] as const;
type DarkModePreference = (typeof DARK_MODE_OPTIONS)[number];

const DEFAULT_SETTINGS = {
  // New settings from Figma design
  appIcon: 'default' as const,

  catTheme: true,
  hasPremium: false,

  darkMode: 'system' as DarkModePreference,

  highContrastMode: false,

  reduceMotion: false,

  showCalendarView: true,

  showCharacterScreen: true,

  showConsistency: true,

  showEmojis: true,

  showMotivationalMessages: true,
  showWeekCompletionBar: false,
  showNotesStats: true,
  showStreaks: true,
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
      appIcon: settings?.appIcon ?? DEFAULT_SETTINGS.appIcon,
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: normalizeDarkMode(settings?.darkMode),
      hasPremium: settings?.hasPremium ?? DEFAULT_SETTINGS.hasPremium,
      highContrastMode:
        settings?.highContrastMode ?? DEFAULT_SETTINGS.highContrastMode,
      reduceMotion: settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
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
      showWeekCompletionBar:
        settings?.showWeekCompletionBar ??
        DEFAULT_SETTINGS.showWeekCompletionBar,
      showNotesStats:
        settings?.showNotesStats ?? DEFAULT_SETTINGS.showNotesStats,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
      useDyslexicFont:
        settings?.useDyslexicFont ?? DEFAULT_SETTINGS.useDyslexicFont,
    };
  },
  returns: v.object({
    appIcon: v.string(),
    catTheme: v.boolean(),
    hasPremium: v.boolean(),
    darkMode: v.union(
      v.literal('system'),
      v.literal('light'),
      v.literal('dark')
    ),
    highContrastMode: v.boolean(),
    reduceMotion: v.boolean(),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showWeekCompletionBar: v.boolean(),
    showNotesStats: v.boolean(),
    showStreaks: v.boolean(),
    useDyslexicFont: v.boolean(),
  }),
});

export const update = mutation({
  args: {
    appIcon: v.optional(v.string()),
    catTheme: v.boolean(),
    hasPremium: v.optional(v.boolean()),
    darkMode: v.union(
      v.literal('system'),
      v.literal('light'),
      v.literal('dark'),
      v.boolean()
    ),
    highContrastMode: v.optional(v.boolean()),
    reduceMotion: v.optional(v.boolean()),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.optional(v.boolean()),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showWeekCompletionBar: v.optional(v.boolean()),
    showNotesStats: v.optional(v.boolean()),
    showStreaks: v.boolean(),
    useDyslexicFont: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get first settings record (since auth was removed, just use any settings)
    const existing = await ctx.db.query('userSettings').first();

    const normalizedArgs = {
      ...args,
      darkMode: normalizeDarkMode(args.darkMode),
    } satisfies typeof args;

    await (existing
      ? ctx.db.patch(existing._id, normalizedArgs)
      : ctx.db.insert('userSettings', normalizedArgs));
    return null;
  },
  returns: v.null(),
});
