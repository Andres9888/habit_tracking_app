/* eslint-disable max-lines */
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
import { fetchCanonicalRevenueCatSubscriberState } from './revenuecatSubscriber';

const TRANSFER_EVENTS = new Set(['TRANSFER']);

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

/**
 * Main webhook handler for RevenueCat events
 */
export const revenuecatWebhook = httpAction(async (ctx, request) => {
  try {
    const body = await request.text();
    const signature =
      request.headers.get('X-RevenueCat-Webhook-Signature') ?? '';

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

    if (!eventType || !appUserId) {
      console.error('[RevenueCat] Missing event type or app_user_id');
      return new Response('Invalid payload', { status: 400 });
    }

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

    // Event processing logged via Convex dashboard

    const canonicalSubscriberState =
      await fetchCanonicalRevenueCatSubscriberState(appUserId);

    await ctx.runMutation(
      internal.subscriptions.reconcileRevenueCatSubscriber,
      {
        cancelledAt: canonicalSubscriberState.cancelledAt,
        clerkId: appUserId,
        eventId,
        eventTimestamp,
        eventType,
        expiresAt: canonicalSubscriberState.expiresAt,
        hasBillingIssue: canonicalSubscriberState.hasBillingIssue,
        isActive: canonicalSubscriberState.isActive,
        isTrialing: canonicalSubscriberState.isTrialing,
        planType: canonicalSubscriberState.planType,
        productId: canonicalSubscriberState.productId,
        revenueCatId: canonicalSubscriberState.revenueCatId,
        trialEndsAt: canonicalSubscriberState.trialEndsAt,
      }
    );

    // Transfer events also need ownership cleanup for the source IDs RevenueCat
    // includes only on the webhook payload.
    if (TRANSFER_EVENTS.has(eventType)) {
      await ctx.runMutation(internal.subscriptions.transferPremium, {
        clerkId: appUserId,
        eventId,
        eventTimestamp,
        transferredFrom: Array.isArray(event.transferred_from)
          ? event.transferred_from.filter(
              (id: unknown): id is string => typeof id === 'string'
            )
          : [],
        transferredTo: Array.isArray(event.transferred_to)
          ? event.transferred_to.filter(
              (id: unknown): id is string => typeof id === 'string'
            )
          : [appUserId],
      });
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
