/**
 * Subscription helper utilities
 */
import type { MutationCtx } from '../_generated/server';

/** Update userSettings.hasPremium — fast-path used by the UI */
export async function updateUserSettingsPremium(
  ctx: MutationCtx,
  clerkId: string,
  hasPremium: boolean
) {
  const settings = await ctx.db
    .query('userSettings')
    .withIndex('by_userId', (q) => q.eq('userId', clerkId))
    .first();

  if (settings) {
    await ctx.db.patch(settings._id, { hasPremium });
    // Premium status updated successfully
  } else {
    console.error('[subscriptions] No settings found for clerkId:', clerkId);
  }
}
