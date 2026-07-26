/**
 * Subscription helper utilities
 */
import type { MutationCtx } from '../_generated/server';
import { DEFAULT_SETTINGS } from '../settings/types';

/** Update userSettings.hasPremium — creates settings if missing */
export async function updateUserSettingsPremium(
  ctx: MutationCtx,
  clerkId: string,
  hasPremium: boolean
) {
  const settings = await ctx.db
    .query('userSettings')
    .withIndex('by_userId', (q) => q.eq('userId', clerkId))
    .first();

  await (settings ? ctx.db.patch(settings._id, { hasPremium }) : ctx.db.insert('userSettings', {
      ...DEFAULT_SETTINGS,
      hasPremium,
      userId: clerkId,
    }));
}
