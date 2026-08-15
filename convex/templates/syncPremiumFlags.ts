/**
 * Apply isPremium on every catalog row so existing installs pick up
 * the curated premium set without a full reseed.
 */
import { v } from 'convex/values';
import type { MutationCtx } from '../_generated/server';
import { internalMutation, mutation } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';
import { isPremiumTemplate } from './premiumFlags';

export async function applyPremiumFlags(ctx: MutationCtx) {
  const templates = await ctx.db.query('templates').collect();
  let updatedCount = 0;
  for (const template of templates) {
    const isPremium = isPremiumTemplate(template.name, template.category);
    if (template.isPremium === isPremium) continue;
    await ctx.db.patch(template._id, { isPremium });
    updatedCount++;
  }
  return { scanned: templates.length, updatedCount };
}

const syncReturns = v.object({
  scanned: v.number(),
  updatedCount: v.number(),
});

export const sync = internalMutation({
  args: {},
  returns: syncReturns,
  handler: async (ctx) => applyPremiumFlags(ctx),
});

export const syncFromClient = mutation({
  args: {},
  returns: syncReturns,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to sync templates');
    }
    await enforceRateLimit(ctx, identity.subject, 'templates.syncPremiumFlags');
    return await applyPremiumFlags(ctx);
  },
});
