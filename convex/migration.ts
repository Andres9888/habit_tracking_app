import { internalMutation } from "./_generated/server";

export const migrateDarkModeSettings = internalMutation({
  handler: async (ctx) => {
    // Find all userSettings documents that don't have darkMode field
    const allSettings = await ctx.db.query("userSettings").collect();

    for (const setting of allSettings) {
      if (setting.darkMode === undefined) {
        await ctx.db.patch(setting._id, {
          darkMode: false, // Default value
        });
      }
    }

    return { migrated: allSettings.length };
  },
});
