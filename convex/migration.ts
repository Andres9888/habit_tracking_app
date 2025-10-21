import { internalMutation } from './_generated/server';

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
