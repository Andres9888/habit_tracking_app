/**
 * Database Migrations
 *
 * Internal mutations for one-time data migrations.
 * Run these manually via Convex dashboard when schema changes require
 * updating existing documents.
 *
 * Migrations are idempotent - safe to run multiple times.
 */

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
