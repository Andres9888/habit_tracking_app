/**
 * Settings Convex queries and mutations
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { normalizeDarkMode, normalizeHabitSortMode } from './normalizers';
import { DEFAULT_SETTINGS } from './types';
import { settingsReturnValidator, updateArgsValidator } from './validators';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query('userSettings').first();

    return {
      appIcon: settings?.appIcon ?? DEFAULT_SETTINGS.appIcon,
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      darkMode: normalizeDarkMode(settings?.darkMode),
      dayShape: settings?.dayShape ?? DEFAULT_SETTINGS.dayShape,
      habitCompletionIcon:
        settings?.habitCompletionIcon ?? DEFAULT_SETTINGS.habitCompletionIcon,
      habitSortMode: normalizeHabitSortMode(
        settings?.habitSortMode,
        settings?.sortHabitsAlphabetically
      ),
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
      showNotesStats:
        settings?.showNotesStats ?? DEFAULT_SETTINGS.showNotesStats,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
      showWeekCompletionBar:
        settings?.showWeekCompletionBar ??
        DEFAULT_SETTINGS.showWeekCompletionBar,
      useDyslexicFont:
        settings?.useDyslexicFont ?? DEFAULT_SETTINGS.useDyslexicFont,
    };
  },
  returns: settingsReturnValidator,
});

export const update = mutation({
  args: updateArgsValidator,
  handler: async (ctx, args) => {
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
