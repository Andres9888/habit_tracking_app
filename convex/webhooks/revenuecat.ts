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
const GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
]);
const REVOKE_EVENTS = new Set(['CANCELLATION', 'EXPIRATION']);
const BILLING_EVENTS = new Set(['BILLING_ISSUE']);

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
    // app_user_id is nested inside the event object, NOT at the payload root
    const appUserId: string | undefined = event?.app_user_id;

    if (!eventType || !appUserId) {
      console.error('[RevenueCat] Missing event type or app_user_id');
      return new Response('Invalid payload', { status: 400 });
    }

    console.log('[RevenueCat] Processing event:', eventType, 'for:', appUserId);

    // Route to appropriate handler based on event type
    if (GRANT_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.grantPremium, {
        clerkId: appUserId,
        eventType,
        expiresAt: event.expiration_at_ms,
        isTrialing: event.period_type === 'TRIAL',
        productId: event.product_id,
        revenueCatId: event.original_app_user_id,
        trialEndsAt: event.trial_end_at_ms,
      });
    } else if (REVOKE_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.revokePremium, {
        clerkId: appUserId,
        eventType,
      });
    } else if (BILLING_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.setBillingIssue, {
        clerkId: appUserId,
      });
    } else {
      // Log unknown events but don't fail
      console.log('[RevenueCat] Unhandled event type:', eventType);
    }

    // Always return 200 to acknowledge receipt
    return Response.json(
      { received: true },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[RevenueCat] Webhook error:', error);
    // Return 500 so RevenueCat retries failed events
    return Response.json(
      { error: 'Processing error' },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
