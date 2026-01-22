/**
 * RevenueCat Webhook Handler
 *
 * SEC-002: Server-side premium validation via RevenueCat webhooks
 *
 * This handler receives webhook events from RevenueCat when subscription
 * state changes occur. It verifies the signature and delegates to
 * internal mutations to update the database.
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks
 */

import { httpAction } from '../_generated/server';
import { internal } from '../_generated/api';
import { verifyRevenueCatSignature } from './revenuecatSignature';

// RevenueCat webhook event types we handle
const GRANT_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
];
const REVOKE_EVENTS = ['CANCELLATION', 'EXPIRATION'];
const BILLING_EVENTS = ['BILLING_ISSUE'];

/**
 * Main webhook handler for RevenueCat events
 */
export const revenuecatWebhook = httpAction(async (ctx, request) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('X-RevenueCat-Signature') ?? '';

    // Verify webhook signature
    const isValid = await verifyRevenueCatSignature(body, signature);
    if (!isValid) {
      console.error('[RevenueCat] Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const eventType = event?.type;
    const appUserId = payload.app_user_id; // This is the Clerk user ID

    if (!eventType || !appUserId) {
      console.error('[RevenueCat] Missing event type or app_user_id');
      return new Response('Invalid payload', { status: 400 });
    }

    console.log('[RevenueCat] Processing event:', eventType, 'for:', appUserId);

    // Route to appropriate handler based on event type
    if (GRANT_EVENTS.includes(eventType)) {
      await ctx.runMutation(internal.subscriptions.grantPremium, {
        clerkId: appUserId,
        revenueCatId: event.app_user_id,
        productId: event.product_id,
        expiresAt: event.expiration_at_ms,
        trialEndsAt: event.trial_end_at_ms,
        isTrialing: event.is_trial_period === true,
        eventType,
      });
    } else if (REVOKE_EVENTS.includes(eventType)) {
      await ctx.runMutation(internal.subscriptions.revokePremium, {
        clerkId: appUserId,
        eventType,
      });
    } else if (BILLING_EVENTS.includes(eventType)) {
      await ctx.runMutation(internal.subscriptions.setBillingIssue, {
        clerkId: appUserId,
      });
    } else {
      // Log unknown events but don't fail
      console.log('[RevenueCat] Unhandled event type:', eventType);
    }

    // Always return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[RevenueCat] Webhook error:', error);
    // Return 200 to prevent retries for malformed requests
    return new Response(JSON.stringify({ error: 'Processing error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
