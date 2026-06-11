/* eslint-disable max-lines-per-function */
/**
 * Settings Convex queries and mutations
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import {
  requireValid,
  validateIdentifier,
  validateTimeFormat,
} from '../lib/inputValidation';
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
        .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
        .first();
    }
    // SEC-001: No fallback — return defaults if no user-specific settings exist

    return {
      appIcon: settings?.appIcon ?? DEFAULT_SETTINGS.appIcon,
      catTheme: settings?.catTheme ?? DEFAULT_SETTINGS.catTheme,
      celebrationsEnabled:
        settings?.celebrationsEnabled ?? DEFAULT_SETTINGS.celebrationsEnabled,
      compactView: settings?.compactView ?? DEFAULT_SETTINGS.compactView,
      completionSoundEnabled:
        settings?.completionSoundEnabled ??
        DEFAULT_SETTINGS.completionSoundEnabled,
      completionSoundType:
        settings?.completionSoundType ?? DEFAULT_SETTINGS.completionSoundType,
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
      progressEmojis: settings?.progressEmojis,
      customProgressEmojis: settings?.customProgressEmojis,
      reduceMotion: settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
      showCalendarView:
        settings?.showCalendarView ?? DEFAULT_SETTINGS.showCalendarView,
      showCharacterScreen:
        settings?.showCharacterScreen ?? DEFAULT_SETTINGS.showCharacterScreen,
      showConsistency:
        settings?.showConsistency ?? DEFAULT_SETTINGS.showConsistency,
      showEmojis: settings?.showEmojis ?? DEFAULT_SETTINGS.showEmojis,
      showGradientFill:
        settings?.showGradientFill ?? DEFAULT_SETTINGS.showGradientFill,
      showStreakConnections:
        settings?.showStreakConnections ??
        DEFAULT_SETTINGS.showStreakConnections,
      showMotivationalMessages:
        settings?.showMotivationalMessages ??
        DEFAULT_SETTINGS.showMotivationalMessages,
      stickyCalendarHeader:
        settings?.stickyCalendarHeader ?? DEFAULT_SETTINGS.stickyCalendarHeader,
      showStreaks: settings?.showStreaks ?? DEFAULT_SETTINGS.showStreaks,
      showWeekCompletionBar:
        settings?.showWeekCompletionBar ??
        DEFAULT_SETTINGS.showWeekCompletionBar,
      streakRemindersEnabled:
        settings?.streakRemindersEnabled ??
        DEFAULT_SETTINGS.streakRemindersEnabled,
      streakReminderTime:
        settings?.streakReminderTime ?? DEFAULT_SETTINGS.streakReminderTime,
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
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .first();

    // Defense-in-depth: the v.string() validators above accept any string;
    // enforce format + length before persisting free-text fields.
    const streakReminderTime = requireValid(
      validateTimeFormat(args.streakReminderTime, 'Streak reminder time'),
      args.streakReminderTime
    );
    const appIcon = requireValid(
      validateIdentifier(args.appIcon, 64, 'App icon'),
      args.appIcon
    );

    const normalizedArgs = {
      ...args,
      ...(args.streakReminderTime === undefined ? {} : { streakReminderTime }),
      ...(args.appIcon === undefined ? {} : { appIcon }),
      ...(args.darkMode === undefined
        ? {}
        : { darkMode: normalizeDarkMode(args.darkMode) }),
    };

    if (!existing) {
      await ctx.db.insert('userSettings', {
        ...DEFAULT_SETTINGS,
        ...normalizedArgs,
        userId: identity.subject,
      });
      return null;
    }

    await ctx.db.patch(existing._id, normalizedArgs);
    return null;
  },
  returns: v.null(),
});
