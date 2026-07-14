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
import { enforceRateLimit } from '../lib/rateLimit';
import { normalizeDarkMode } from './normalizers';
import { DEFAULT_SETTINGS } from './types';
import { toSettingsResponse } from './getResponse';
import { settingsReturnValidator, updateArgsValidator } from './validators';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';

export const get = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Get user identity for user-scoped settings
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to read settings');
    }

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .first();

    return toSettingsResponse(
      settings,
      await hasPremiumAccess(ctx, identity.subject)
    );
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

    // SEC: defense-in-depth against premium self-grant. hasPremium is an
    // entitlement field writable only by the RevenueCat webhook. It is already
    // excluded from updateArgsValidator; this guard fires only if that
    // exclusion is ever regressed, preventing a silent mass-assignment hole.
    if ('hasPremium' in args) {
      throw new Error(
        'Forbidden: hasPremium cannot be set via settings.update'
      );
    }

    // SR: throttle settings writes per user (defense against session abuse).
    await enforceRateLimit(ctx, identity.subject, 'settings.update');

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
