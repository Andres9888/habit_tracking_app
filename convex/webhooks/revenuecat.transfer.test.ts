/** @jest-environment node */
import { internal } from '../_generated/api';
import { revenuecatWebhook } from './revenuecat';

jest.mock('./revenuecatSignature', () => ({
  verifyRevenueCatSignature: async () => true,
}));

const handler = (
  revenuecatWebhook as unknown as {
    _handler: (ctx: unknown, req: Request) => Promise<Response>;
  }
)._handler;

const post = (event: Record<string, unknown>) =>
  new Request('https://example.test/revenuecat-webhook', {
    body: JSON.stringify({ event }),
    headers: {
      'X-RevenueCat-Signature': 'x',
      'X-RevenueCat-Webhook-Signature': 'x',
    },
    method: 'POST',
  });

describe('revenuecat webhook TRANSFER routing', () => {
  it('routes TRANSFER to transferPremium with both id lists', async () => {
    const ctx = { runMutation: jest.fn() };
    const res = await handler(
      ctx,
      post({
        event_timestamp_ms: 1788537600000,
        id: 'evt_t',
        transferred_from: ['old', 42, ''],
        transferred_to: ['new'],
        type: 'TRANSFER',
      })
    );
    expect(res.status).toBe(200);
    expect(ctx.runMutation).toHaveBeenCalledWith(
      internal.subscriptions.transfer.transferPremium,
      {
        eventId: 'evt_t',
        eventTimestamp: 1788537600000,
        fromClerkIds: ['old'],
        toClerkIds: ['new'],
      }
    );
  });

  it('rejects a TRANSFER that names no accounts', async () => {
    const ctx = { runMutation: jest.fn() };
    const res = await handler(
      ctx,
      post({ event_timestamp_ms: 1788537600000, id: 'evt_t', type: 'TRANSFER' })
    );
    expect(res.status).toBe(400);
    expect(ctx.runMutation).not.toHaveBeenCalled();
  });

  it('still requires app_user_id for every other event type', async () => {
    const ctx = { runMutation: jest.fn() };
    const res = await handler(
      ctx,
      post({ event_timestamp_ms: 1788537600000, id: 'evt_r', type: 'RENEWAL' })
    );
    expect(res.status).toBe(400);
    expect(ctx.runMutation).not.toHaveBeenCalled();
  });
});
