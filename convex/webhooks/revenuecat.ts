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
import { validateWebhookTimestamp } from '../subscriptions/premiumCheck';

// RevenueCat webhook event types we handle
const GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
]);
const REVOKE_EVENTS = new Set(['CANCELLATION', 'EXPIRATION']);
const BILLING_EVENTS = new Set(['BILLING_ISSUE']);

function getWebhookEventTimestamp(
  event: Record<string, number | string | undefined>
): number | undefined {
  return (
    validateWebhookTimestamp(
      event.event_timestamp_ms as number | undefined,
      'event_timestamp_ms'
    ) ??
    validateWebhookTimestamp(
      event.purchased_at_ms as number | undefined,
      'purchased_at_ms'
    ) ??
    validateWebhookTimestamp(
      event.expiration_at_ms as number | undefined,
      'expiration_at_ms'
    )
  );
}

function readIdList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((id): id is string => typeof id === 'string' && id !== '')
    : [];
}

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

    // Malformed JSON is a permanent client error: return 400 so RevenueCat
    // does not retry it forever (5xx responses are retried indefinitely).
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      console.error('[RevenueCat] Malformed JSON webhook body');
      return Response.json(
        { error: 'Invalid JSON' },
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    const event = payload.event;
    const eventType = event?.type;
    // app_user_id is nested inside the event object, NOT at the payload root
    const appUserId: string | undefined = event?.app_user_id;
    // event.id is RevenueCat's unique identifier per event — used for
    // deduplication. SR-2026-04-17-15: required, not optional, so a
    // malformed payload can't slip past replay protection.
    const eventId: string | undefined = event?.id;

    if (!eventId || typeof eventId !== 'string') {
      console.error(
        '[RevenueCat] Missing event id — required for replay protection'
      );
      return new Response('Invalid payload', { status: 400 });
    }

    const eventTimestamp = getWebhookEventTimestamp(event ?? {});
    if (!eventTimestamp) {
      console.error('[RevenueCat] Missing valid webhook event timestamp');
      return new Response('Invalid payload', { status: 400 });
    }

    // TRANSFER carries no app_user_id: the entitlement moved between the
    // `transferred_from` and `transferred_to` app user ids. RevenueCat's
    // default restore behaviour emits this, so it must be honoured or the old
    // account keeps server-side premium forever.
    if (eventType === 'TRANSFER') {
      const fromClerkIds = readIdList(event.transferred_from);
      const toClerkIds = readIdList(event.transferred_to);
      if (fromClerkIds.length === 0 && toClerkIds.length === 0) {
        console.error('[RevenueCat] TRANSFER without transferred_from/to');
        return new Response('Invalid payload', { status: 400 });
      }
      await ctx.runMutation(internal.subscriptions.transfer.transferPremium, {
        eventId,
        eventTimestamp,
        fromClerkIds,
        toClerkIds,
      });
      return Response.json(
        { received: true },
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!eventType || !appUserId) {
      console.error('[RevenueCat] Missing event type or app_user_id');
      return new Response('Invalid payload', { status: 400 });
    }

    // Event processing logged via Convex dashboard

    // Extract and validate timestamps from webhook
    const validatedExpiresAt = validateWebhookTimestamp(
      event.expiration_at_ms,
      'expiration_at_ms'
    );
    const validatedTrialEndsAt = validateWebhookTimestamp(
      event.trial_end_at_ms,
      'trial_end_at_ms'
    );

    // Route to appropriate handler based on event type
    if (GRANT_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.grantPremium, {
        clerkId: appUserId,
        eventId,
        eventTimestamp,
        eventType,
        expiresAt: validatedExpiresAt,
        isTrialing: event.period_type === 'TRIAL',
        productId: event.product_id,
        revenueCatId: event.original_app_user_id,
        trialEndsAt: validatedTrialEndsAt,
      });
    } else if (REVOKE_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.revokePremium, {
        clerkId: appUserId,
        eventId,
        eventTimestamp,
        eventType,
      });
    } else if (BILLING_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.setBillingIssue, {
        clerkId: appUserId,
        eventId,
        eventTimestamp,
      });
    } else {
      // Unhandled event type — no action needed
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
