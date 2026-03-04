/**
 * Database Migrations
 *
 * Internal mutations for one-time data migrations.
 * Run these manually via Convex dashboard when schema changes require
 * updating existing documents.
 *
 * Migrations are idempotent - safe to run multiple times.
 */

import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import { validateTimeFormat } from './lib/inputValidation';

const MAX_BATCH_SIZE = 500;

interface MigrationResult {
  continueCursor?: string | null;
  isDone: boolean;
  migrated: number;
  scanned: number;
  skipped: number;
}

function normalizeReminderTime(reminderTime: unknown): string | undefined {
  if (typeof reminderTime !== 'string') {
    return undefined;
  }

  const trimmed = reminderTime.trim();
  if (!trimmed) {
    return undefined;
  }

  const validation = validateTimeFormat(trimmed, 'Reminder time');
  if (validation.isValid) {
    return validation.sanitized ?? trimmed;
  }

  const legacyMatch = /^(\d{1,2}):([0-5]\d)$/.exec(trimmed);
  if (!legacyMatch) {
    return undefined;
  }

  const hour = Number.parseInt(legacyMatch[1], 10);
  const minute = Number.parseInt(legacyMatch[2], 10);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }

  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Migrates darkMode settings from boolean to enum format.
 *
 * Before: darkMode: true/false or undefined
 * After: darkMode: 'dark' | 'light' | 'system'
 *
 * Run via: npx convex run migration:migrateDarkModeSettings
 */
export const migrateDarkModeSettings = internalMutation({
  handler: async (ctx) => {
    // Find all userSettings documents that don't have darkMode field
    const allSettings = await ctx.db.query('userSettings').collect();

    for (const setting of allSettings) {
      if (setting.darkMode === undefined) {
        await ctx.db.patch(setting._id, {
          darkMode: 'system',
        });
        continue;
      }

      if (typeof setting.darkMode === 'boolean') {
        await ctx.db.patch(setting._id, {
          darkMode: setting.darkMode ? 'dark' : 'light',
        });
      }
    }

    return { migrated: allSettings.length };
  },
});

/**
 * Backfills tracking.userId from the owning habit's userId.
 *
 * Run in batches until isDone=true:
 * npx convex run migration:backfillTrackingUserId
 * npx convex run migration:backfillTrackingUserId '{"cursor":"<continueCursor>"}'
 */
export const backfillTrackingUserId = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const requestedSize = args.batchSize ?? 200;
    const batchSize = Math.max(1, Math.min(requestedSize, 1000));

    const page = await ctx.db.query('tracking').paginate({
      cursor: args.cursor ?? null,
      numItems: batchSize,
    });

    const habitIds = [...new Set(page.page.map((entry) => entry.habitId))];
    const habitOwnerByHabitId = new Map<(typeof habitIds)[number], string>();

    for (const habitId of habitIds) {
      const habit = await ctx.db.get(habitId);
      if (habit?.userId) {
        habitOwnerByHabitId.set(habitId, habit.userId);
      }
    }

    let migrated = 0;
    let skippedNoHabitOwner = 0;

    for (const entry of page.page) {
      if (entry.userId) {
        continue;
      }

      const ownerId = habitOwnerByHabitId.get(entry.habitId);
      if (!ownerId) {
        skippedNoHabitOwner++;
        continue;
      }

      await ctx.db.patch(entry._id, { userId: ownerId });
      migrated++;
    }

    return {
      continueCursor: page.continueCursor,
      isDone: page.isDone,
      migrated,
      scanned: page.page.length,
      skippedNoHabitOwner,
    };
  },
});

/**
 * Normalizes reminderTime values on habits to the canonical HH:MM format.
 *
 * - Accepts AM/PM values that were previously persisted and converts them to HH:MM.
 * - Left-pads single-digit hours (for legacy "8:30" values).
 *
 * Run in batches until isDone=true:
 * npx convex run migration:normalizeHabitReminderTimes
 * npx convex run migration:normalizeHabitReminderTimes '{"cursor":"<continueCursor>"}'
 */
export const normalizeHabitReminderTimes = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<MigrationResult> => {
    const requestedSize = args.batchSize ?? 200;
    const batchSize = Math.max(1, Math.min(requestedSize, MAX_BATCH_SIZE));

    const page = await ctx.db.query('habits').paginate({
      cursor: args.cursor ?? null,
      numItems: batchSize,
    });

    let migrated = 0;
    let skipped = 0;

    for (const habit of page.page) {
      const normalized = normalizeReminderTime(habit.reminderTime);
      if (!normalized) {
        if (habit.reminderTime) {
          skipped++;
        }
        continue;
      }

      if (habit.reminderTime !== normalized) {
        await ctx.db.patch(habit._id, {
          reminderTime: normalized,
        });
        migrated++;
      }
    }

    return {
      continueCursor: page.continueCursor,
      isDone: page.isDone,
      migrated,
      scanned: page.page.length,
      skipped,
    };
  },
});
