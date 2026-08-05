# RevenueCat Integration - Phase 2: Convex Backend Integration

## Overview
Create the Convex backend infrastructure to store subscription state and handle RevenueCat webhooks.

## Prerequisites
- Phase 1 completed (SDK installed, `usePremium` hook created)
- Convex deployment URL available

---

## Tasks

### 1. Add Subscriptions Table to Schema

- [ ] Update `convex/schema.ts` - Add subscriptions table after `userSettings`:

```typescript
// Add this after the userSettings table definition (around line 434):

// Subscriptions - RevenueCat subscription state
// Synced via webhooks for server-side source of truth
// The hasPremium field in userSettings is the fast-path for UI
subscriptions: defineTable({
  // User identification
  clerkId: v.string(), // Clerk user ID (primary identifier)
  revenueCatId: v.optional(v.string()), // RevenueCat app_user_id

  // Subscription state
  status: v.union(
    v.literal('active'),
    v.literal('trialing'),
    v.literal('past_due'),
    v.literal('cancelled'),
    v.literal('expired'),
    v.literal('unknown')
  ),

  // Product info
  productId: v.optional(v.string()), // e.g., "premium_monthly_699"
  planType: v.optional(
    v.union(v.literal('monthly'), v.literal('yearly'))
  ),

  // Important dates (stored as timestamps)
  startedAt: v.number(), // When subscription started
  expiresAt: v.optional(v.number()), // When it expires/renews
  trialEndsAt: v.optional(v.number()), // Trial end date (if trialing)
  cancelledAt: v.optional(v.number()), // When user cancelled (may still be active)

  // Billing status
  hasBillingIssue: v.optional(v.boolean()), // Grace period for failed payment

  // Audit fields
  createdAt: v.number(),
  updatedAt: v.number(),
  lastWebhookEvent: v.optional(v.string()), // Last processed event type
  lastWebhookAt: v.optional(v.number()), // When last webhook was processed
})
  .index('by_clerk_id', ['clerkId'])
  .index('by_revenuecat_id', ['revenueCatId'])
  .index('by_status', ['status']),
```

---

### 2. Create Subscription Mutations

- [ ] Create `convex/subscriptions.ts`:

```typescript
/**
 * Subscription mutations for RevenueCat webhook handling
 *
 * These mutations are called by the HTTP webhook handler to update
 * subscription state based on RevenueCat events.
 */

import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';

// Status type for reuse
const subscriptionStatus = v.union(
  v.literal('active'),
  v.literal('trialing'),
  v.literal('past_due'),
  v.literal('cancelled'),
  v.literal('expired'),
  v.literal('unknown')
);

/**
 * Get subscription by Clerk ID
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});

/**
 * Get subscription by RevenueCat ID
 */
export const getByRevenueCatId = query({
  args: { revenueCatId: v.string() },
  handler: async (ctx, { revenueCatId }) => {
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_revenuecat_id', (q) => q.eq('revenueCatId', revenueCatId))
      .first();
  },
});

/**
 * Grant premium access (called on INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE)
 */
export const grantPremium = internalMutation({
  args: {
    clerkId: v.string(),
    revenueCatId: v.optional(v.string()),
    productId: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    isTrialing: v.optional(v.boolean()),
    eventType: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.isTrialing ? 'trialing' : 'active';

    // Find existing subscription
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        status,
        productId: args.productId,
        planType: args.productId?.includes('yearly') ? 'yearly' : 'monthly',
        expiresAt: args.expiresAt,
        trialEndsAt: args.trialEndsAt,
        hasBillingIssue: false,
        updatedAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookAt: now,
      });
    } else {
      // Create new subscription
      await ctx.db.insert('subscriptions', {
        clerkId: args.clerkId,
        revenueCatId: args.revenueCatId,
        status,
        productId: args.productId,
        planType: args.productId?.includes('yearly') ? 'yearly' : 'monthly',
        startedAt: now,
        expiresAt: args.expiresAt,
        trialEndsAt: args.trialEndsAt,
        createdAt: now,
        updatedAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookAt: now,
      });
    }

    // Also update userSettings.hasPremium for fast UI access
    await updateUserSettingsPremium(ctx, args.clerkId, true);
  },
});

/**
 * Revoke premium access (called on CANCELLATION, EXPIRATION)
 */
export const revokePremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventType: v.string(),
  },
  handler: async (ctx, { clerkId, eventType }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing) {
      const status = eventType === 'CANCELLATION' ? 'cancelled' : 'expired';

      await ctx.db.patch(existing._id, {
        status,
        cancelledAt: eventType === 'CANCELLATION' ? now : existing.cancelledAt,
        updatedAt: now,
        lastWebhookEvent: eventType,
        lastWebhookAt: now,
      });
    }

    // Update userSettings.hasPremium
    await updateUserSettingsPremium(ctx, clerkId, false);
  },
});

/**
 * Set billing issue flag (called on BILLING_ISSUE)
 * User keeps access during grace period
 */
export const setBillingIssue = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: 'past_due',
        hasBillingIssue: true,
        updatedAt: now,
        lastWebhookEvent: 'BILLING_ISSUE',
        lastWebhookAt: now,
      });
    }
    // Note: We don't revoke premium during billing issues (grace period)
  },
});

/**
 * Helper to update userSettings.hasPremium
 * This is the fast-path used by the UI
 */
async function updateUserSettingsPremium(
  ctx: any,
  clerkId: string,
  hasPremium: boolean
) {
  // Find user by clerkId
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q: any) => q.eq('clerkId', clerkId))
    .first();

  if (!user) {
    console.log('[subscriptions] User not found for clerkId:', clerkId);
    return;
  }

  // Find their settings
  const settings = await ctx.db
    .query('userSettings')
    .filter((q: any) => q.eq(q.field('userId'), user._id.toString()))
    .first();

  if (settings) {
    await ctx.db.patch(settings._id, { hasPremium });
    console.log('[subscriptions] Updated hasPremium:', hasPremium, 'for user:', clerkId);
  } else {
    console.log('[subscriptions] No settings found for user:', clerkId);
  }
}
```

---

### 3. Update HTTP Router for Webhooks

- [ ] Update `convex/router.ts` to handle RevenueCat webhooks:

```typescript
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const http = httpRouter();

/**
 * RevenueCat Webhook Handler
 *
 * Receives events from RevenueCat when subscription state changes.
 * Configure webhook URL in RevenueCat Dashboard:
 * https://<your-convex-deployment>.convex.site/revenuecat-webhook
 *
 * Events handled:
 * - INITIAL_PURCHASE: New subscription started
 * - RENEWAL: Subscription renewed
 * - PRODUCT_CHANGE: User changed plan
 * - CANCELLATION: User cancelled (may still have access until expiry)
 * - EXPIRATION: Subscription expired
 * - BILLING_ISSUE: Payment failed, grace period started
 *
 * @see https://docs.revenuecat.com/docs/webhooks
 */
http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      // TODO: Verify webhook signature (recommended for production)
      // const signature = request.headers.get('Authorization');
      // if (!verifySignature(signature, await request.text())) {
      //   return new Response('Unauthorized', { status: 401 });
      // }

      const body = await request.json();

      // RevenueCat webhook payload structure
      const {
        event,
        api_version,
      } = body;

      // The event object contains the subscription details
      const {
        type: eventType,
        app_user_id: appUserId,
        product_id: productId,
        expiration_at_ms: expirationAtMs,
        // Additional fields available:
        // price_in_purchased_currency, currency, store, environment, etc.
      } = event;

      console.log('[webhook] RevenueCat event:', eventType, 'for user:', appUserId);

      // Extract Clerk ID from app_user_id
      // RevenueCat stores the Clerk ID we passed during initialization
      const clerkId = appUserId;

      if (!clerkId) {
        console.error('[webhook] No user ID in event');
        return new Response('Missing user ID', { status: 400 });
      }

      // Handle different event types
      switch (eventType) {
        case 'INITIAL_PURCHASE':
        case 'RENEWAL':
        case 'PRODUCT_CHANGE':
        case 'UNCANCELLATION': // User re-enabled after cancelling
          await ctx.runMutation(internal.subscriptions.grantPremium, {
            clerkId,
            revenueCatId: appUserId,
            productId,
            expiresAt: expirationAtMs ? Number(expirationAtMs) : undefined,
            isTrialing: eventType === 'INITIAL_PURCHASE' && body.event.period_type === 'TRIAL',
            trialEndsAt: body.event.period_type === 'TRIAL' ? Number(expirationAtMs) : undefined,
            eventType,
          });
          break;

        case 'CANCELLATION':
        case 'EXPIRATION':
          await ctx.runMutation(internal.subscriptions.revokePremium, {
            clerkId,
            eventType,
          });
          break;

        case 'BILLING_ISSUE':
          await ctx.runMutation(internal.subscriptions.setBillingIssue, {
            clerkId,
          });
          break;

        case 'SUBSCRIBER_ALIAS':
          // User ID changed - we can log this but don't need to act
          console.log('[webhook] Subscriber alias event, old:', body.event.aliases);
          break;

        case 'TRANSFER':
          // Subscription transferred to new user
          console.log('[webhook] Transfer event');
          // Handle if needed
          break;

        default:
          console.log('[webhook] Unhandled event type:', eventType);
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('[webhook] Error processing webhook:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }),
});

export default http;
```

---

### 4. Deploy and Get Webhook URL

- [ ] Deploy Convex to get the webhook URL:
```bash
npx convex deploy --preview
```

- [ ] Note the deployment URL (e.g., `https://your-deployment.convex.site`)

- [ ] The webhook URL will be: `https://your-deployment.convex.site/revenuecat-webhook`

---

### 5. Configure Webhook in RevenueCat

- [ ] Go to RevenueCat Dashboard > Your Project > Integrations > Webhooks

- [ ] Add webhook with URL: `https://your-deployment.convex.site/revenuecat-webhook`

- [ ] Enable events:
  - INITIAL_PURCHASE
  - RENEWAL
  - CANCELLATION
  - EXPIRATION
  - BILLING_ISSUE
  - PRODUCT_CHANGE
  - UNCANCELLATION

- [ ] (Optional) Set up authorization header for webhook verification

---

### 6. Test Webhook Locally (Optional)

- [ ] For local testing, use ngrok to expose Convex dev server:
```bash
# In terminal 1
npm run dev:backend

# In terminal 2
ngrok http 3210  # Or whatever port Convex uses
```

- [ ] Update RevenueCat webhook URL temporarily to ngrok URL for testing

---

### 7. Create Subscription Query for UI

- [ ] Add to `convex/subscriptions.ts` - A query the UI can use:

```typescript
/**
 * Get current user's subscription status
 * Used by the UI as a backup to the SDK
 */
export const getCurrentUserSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Clerk stores the user ID in the subject claim
    const clerkId = identity.subject;

    return await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});
```

---

## Verification

After completing all tasks:

1. **Schema deployed**: Run `npx convex deploy` and verify no errors
2. **Webhook accessible**: Test webhook URL with curl:
   ```bash
   curl -X POST https://your-deployment.convex.site/revenuecat-webhook \
     -H "Content-Type: application/json" \
     -d '{"event":{"type":"TEST","app_user_id":"test123"}}'
   ```
3. **Database ready**: Check Convex Dashboard for `subscriptions` table

---

## Next Steps

Once Phase 2 is complete, proceed to:
- **REVENUECAT-03.md**: Connect paywall UI to RevenueCat SDK
