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
import { normalizeDarkMode } from './normalizers';
import { DEFAULT_SETTINGS } from './types';
import { toSettingsResponse } from './getResponse';
import { settingsReturnValidator, updateArgsValidator } from './validators';

/**
 * Defense-in-depth: strip server-owned fields that must never be written from
 * client-supplied settings input. `hasPremium` (entitlement) is owned solely by
 * the RevenueCat webhook path (updateUserSettingsPremium); this guard ensures it
 * can never be mass-assigned through `update`, even if it is accidentally
 * re-added to `updateArgsValidator` in the future.
 */
function stripServerOwnedSettings<T extends Record<string, unknown>>(
  value: T
): Omit<T, 'hasPremium'> {
  const { hasPremium: _hasPremium, ...rest } = value as T & {
    hasPremium?: unknown;
  };
  return rest as Omit<T, 'hasPremium'>;
}

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

    return toSettingsResponse(settings);
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

    const normalizedArgs = stripServerOwnedSettings({
      ...args,
      ...(args.streakReminderTime === undefined ? {} : { streakReminderTime }),
      ...(args.appIcon === undefined ? {} : { appIcon }),
      ...(args.darkMode === undefined
        ? {}
        : { darkMode: normalizeDarkMode(args.darkMode) }),
    });

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
