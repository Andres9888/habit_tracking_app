import {
  DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS,
  REVENUECAT_WEBHOOK_SIGNATURE_HEADER,
  verifyRevenueCatSignature,
} from './revenuecatSignature';

describe('SEC-002: RevenueCat Webhook Signature Verification', () => {
  const secret = 'rc_test_secret';
  const currentUnixTimestampSeconds = 1_700_000_000;
  const body = JSON.stringify({
    event: {
      app_user_id: 'user_123',
      id: 'event_123',
      type: 'INITIAL_PURCHASE',
    },
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('accepts a valid RevenueCat signature header', async () => {
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: currentUnixTimestampSeconds,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(true);
  });

  it('rejects a tampered body even when the header is otherwise valid', async () => {
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: currentUnixTimestampSeconds,
    });
    const tamperedBody = `${body}\n`;

    await expect(
      verifyRevenueCatSignature(tamperedBody, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(false);
  });

  it('rejects a signature created with a different secret', async () => {
    const header = await createSignatureHeader({
      body,
      secret: 'wrong_secret',
      timestamp: currentUnixTimestampSeconds,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(false);
  });

  it.each([
    '',
    't=1700000000',
    'v1=abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    't=1700000000,v1=xyz',
    't=1700000000,t=1700000001,v1=abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    't=1700000000,v1=abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789,v0=legacy',
    't=not-a-number,v1=abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
  ])('rejects malformed signature header: %s', async (header) => {
    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(false);
  });

  it('rejects timestamps older than the tolerance window', async () => {
    const expiredTimestamp =
      currentUnixTimestampSeconds -
      DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS -
      1;
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: expiredTimestamp,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(false);
  });

  it('rejects timestamps newer than the tolerance window', async () => {
    const futureTimestamp =
      currentUnixTimestampSeconds +
      DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS +
      1;
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: futureTimestamp,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(false);
  });

  it('accepts timestamps exactly on the tolerance boundary', async () => {
    const boundaryTimestamp =
      currentUnixTimestampSeconds -
      DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS;
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: boundaryTimestamp,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        secret,
      })
    ).resolves.toBe(true);
  });

  it('rejects verification when the webhook secret is missing', async () => {
    const header = await createSignatureHeader({
      body,
      secret,
      timestamp: currentUnixTimestampSeconds,
    });

    await expect(
      verifyRevenueCatSignature(body, header, {
        currentUnixTimestampSeconds,
        env: {},
      })
    ).resolves.toBe(false);
  });

  it('uses the official RevenueCat webhook signature header name', () => {
    expect(REVENUECAT_WEBHOOK_SIGNATURE_HEADER).toBe(
      'X-RevenueCat-Webhook-Signature'
    );
    expect(REVENUECAT_WEBHOOK_SIGNATURE_HEADER).not.toBe(
      'X-RevenueCat-Signature'
    );
  });
});

async function createSignatureHeader({
  body,
  secret,
  timestamp,
}: {
  body: string;
  secret: string;
  timestamp: number;
}): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${timestamp}.${body}`)
  );

  return `t=${timestamp},v1=${Array.from(
    new Uint8Array(signature),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('')}`;
}
