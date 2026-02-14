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
