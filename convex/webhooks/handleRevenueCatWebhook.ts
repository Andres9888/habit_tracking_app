import { internal } from '../_generated/api';
import type { ActionCtx } from '../_generated/server';
import { validateWebhookTimestamp } from '../subscriptions/premiumCheck';
import { verifyRevenueCatSignature } from './revenuecatSignature';
import {
  BILLING_EVENTS,
  getWebhookEventTimestamp,
  GRANT_EVENTS,
  REVOKE_EVENTS,
} from './revenuecatEvent';

export async function handleRevenueCatWebhook(
  ctx: ActionCtx,
  request: Request
) {
  const body = await request.text();
  const signature = request.headers.get('X-RevenueCat-Signature') ?? '';
  if (!(await verifyRevenueCatSignature(body, signature))) {
    console.error('[RevenueCat] Invalid webhook signature');
    return new Response('Invalid signature', { status: 401 });
  }

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
  const appUserId: string | undefined = event?.app_user_id;
  const eventId: string | undefined = event?.id;
  if (!eventType || !appUserId) {
    console.error('[RevenueCat] Missing event type or app_user_id');
    return new Response('Invalid payload', { status: 400 });
  }
  if (!eventId || typeof eventId !== 'string') {
    console.error('[RevenueCat] Missing event id — required for replay protection');
    return new Response('Invalid payload', { status: 400 });
  }
  const eventTimestamp = getWebhookEventTimestamp(event ?? {});
  if (!eventTimestamp) {
    console.error('[RevenueCat] Missing valid webhook event timestamp');
    return new Response('Invalid payload', { status: 400 });
  }
  const expiresAt = validateWebhookTimestamp(
    event.expiration_at_ms,
    'expiration_at_ms'
  );
  const trialEndsAt = validateWebhookTimestamp(
    event.trial_end_at_ms,
    'trial_end_at_ms'
  );
  if (GRANT_EVENTS.has(eventType)) {
    await ctx.runMutation(internal.subscriptions.grantPremium, {
      clerkId: appUserId,
      eventId,
      eventTimestamp,
      eventType,
      expiresAt,
      isTrialing: event.period_type === 'TRIAL',
      productId: event.product_id,
      revenueCatId: event.original_app_user_id,
      trialEndsAt,
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
  }
  return Response.json(
    { received: true },
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}
