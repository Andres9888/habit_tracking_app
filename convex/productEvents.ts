import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { enforceRateLimit } from './lib/rateLimit';
import { recordProductEvent } from './lib/productEvents';
import {
  productEventNameValidator,
  productEventSourceValidator,
} from './productEvents.constants';

export const track = mutation({
  args: {
    count: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    name: productEventNameValidator,
    platform: v.optional(
      v.union(v.literal('android'), v.literal('ios'), v.literal('web'))
    ),
    release: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    source: v.optional(productEventSourceValidator),
    streak: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated analytics event');

    await enforceRateLimit(ctx, identity.subject, 'product.event');
    const { name, ...fields } = args;
    await recordProductEvent(ctx, identity.subject, name, fields);
    return null;
  },
  returns: v.null(),
});
