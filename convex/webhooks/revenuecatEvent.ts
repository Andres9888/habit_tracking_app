import { validateWebhookTimestamp } from '../subscriptions/premiumCheck';

export const GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
]);
export const REVOKE_EVENTS = new Set(['CANCELLATION', 'EXPIRATION']);
export const BILLING_EVENTS = new Set(['BILLING_ISSUE']);

export function getWebhookEventTimestamp(
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
