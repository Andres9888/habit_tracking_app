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
    // SEC-001: Get user identity for user-scoped settings
    const identity = await ctx.auth.getUserIdentity();

    // Find settings for this user, or fall back to first (for backwards compatibility)
    let settings;
    if (identity) {
      settings = await ctx.db
        .query('userSettings')
        .filter((q) => q.eq(q.field('userId'), identity.subject))
        .first();
    }
    // Fallback for anonymous users or if no user-specific settings exist
    if (!settings) {
      settings = await ctx.db.query('userSettings').first();
    }

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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update settings');
    }

    // SEC-001: Find existing settings for this user
    const existing = await ctx.db
      .query('userSettings')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .first();

    const normalizedArgs = {
      ...args,
      darkMode: normalizeDarkMode(args.darkMode),
      userId: identity.subject,
    };

    await (existing
      ? ctx.db.patch(existing._id, normalizedArgs)
      : ctx.db.insert('userSettings', normalizedArgs));
    return null;
  },
  returns: v.null(),
});
