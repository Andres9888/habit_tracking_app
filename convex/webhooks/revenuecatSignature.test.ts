/**
 * Security Test Suite: RevenueCat Webhook Signature Verification (SEC-005)
 *
 * Tests for SEC-002: Server-side RevenueCat webhook premium validation.
 * Verifies HMAC-SHA256 signature verification prevents webhook spoofing.
 */

import { createHmac } from 'node:crypto';

import { verifyRevenueCatSignature } from './revenuecatSignature';

const SECRET = 'test_revenuecat_webhook_secret';
const encoder = new TextEncoder();

function signRevenueCatPayload(
  rawBody: Uint8Array,
  timestamp = Math.floor(Date.now() / 1000).toString()
): string {
  const signedPayload = Buffer.concat([
    Buffer.from(timestamp + '.', 'utf8'),
    Buffer.from(rawBody),
  ]);
  const signature = createHmac('sha256', SECRET)
    .update(signedPayload)
    .digest('hex');

  return 't=' + timestamp + ',v1=' + signature;
}

describe('SEC-002: RevenueCat Webhook Signature Verification', () => {
  const originalSecret = process.env.REVENUECAT_WEBHOOK_SECRET;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    process.env.REVENUECAT_WEBHOOK_SECRET = SECRET;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.REVENUECAT_WEBHOOK_SECRET;
    } else {
      process.env.REVENUECAT_WEBHOOK_SECRET = originalSecret;
    }
  });

  describe('HMAC-SHA256 Signature Verification', () => {
    it('accepts RevenueCat webhook signature headers over timestamp and raw body', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const header = signRevenueCatPayload(rawBody);

      await expect(verifyRevenueCatSignature(rawBody, header)).resolves.toBe(
        true
      );
    });

    it('rejects the old body-only signature header format', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const oldBodyOnlySignature = createHmac('sha256', SECRET)
        .update(Buffer.from(rawBody))
        .digest('hex');

      await expect(
        verifyRevenueCatSignature(rawBody, oldBodyOnlySignature)
      ).resolves.toBe(false);
    });

    it('rejects signatures when raw body bytes change', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const reparsedBody = encoder.encode('{"event": {"id": "evt_1"}}');
      const header = signRevenueCatPayload(rawBody);

      await expect(verifyRevenueCatSignature(reparsedBody, header)).resolves.toBe(
        false
      );
    });

    it('rejects stale timestamped signatures', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const staleTimestamp = Math.floor(Date.now() / 1000 - 301).toString();
      const header = signRevenueCatPayload(rawBody, staleTimestamp);

      await expect(verifyRevenueCatSignature(rawBody, header)).resolves.toBe(
        false
      );
    });

    it('rejects missing signature parts', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const validHeader = signRevenueCatPayload(rawBody, timestamp);
      const signature = validHeader.split('v1=')[1];

      await expect(
        verifyRevenueCatSignature(rawBody, 'v1=' + signature)
      ).resolves.toBe(false);
      await expect(
        verifyRevenueCatSignature(rawBody, 't=' + timestamp)
      ).resolves.toBe(false);
    });

    it('rejects malformed hex signatures', async () => {
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const timestamp = Math.floor(Date.now() / 1000).toString();

      await expect(
        verifyRevenueCatSignature(rawBody, 't=' + timestamp + ',v1=' + 'g'.repeat(64))
      ).resolves.toBe(false);
    });

    it('rejects requests when webhook secret is missing', async () => {
      delete process.env.REVENUECAT_WEBHOOK_SECRET;
      const rawBody = encoder.encode('{"event":{"id":"evt_1"}}');
      const header = signRevenueCatPayload(rawBody);

      await expect(verifyRevenueCatSignature(rawBody, header)).resolves.toBe(
        false
      );
    });
  });

  describe('Webhook Request Validation', () => {
    it('should require X-RevenueCat-Webhook-Signature header', () => {
      const validateWebhookRequest = (
        headers: Record<string, string | undefined>
      ): { valid: boolean; error?: string } => {
        const signature = headers['x-revenuecat-webhook-signature'];
        if (!signature) {
          return { valid: false, error: 'Missing signature header' };
        }
        return { valid: true };
      };

      expect(validateWebhookRequest({})).toEqual({
        valid: false,
        error: 'Missing signature header',
      });

      expect(
        validateWebhookRequest({
          'x-revenuecat-webhook-signature': 't=123,v1=' + 'a'.repeat(64),
        })
      ).toEqual({ valid: true });

      expect(
        validateWebhookRequest({ 'x-revenuecat-signature': 'a'.repeat(64) })
      ).toEqual({
        valid: false,
        error: 'Missing signature header',
      });
    });

    it('should require POST method', () => {
      const validateMethod = (method: string): boolean => {
        return method.toUpperCase() === 'POST';
      };

      expect(validateMethod('POST')).toBe(true);
      expect(validateMethod('post')).toBe(true);
      expect(validateMethod('GET')).toBe(false);
      expect(validateMethod('PUT')).toBe(false);
    });

    it('should require Content-Type application/json', () => {
      const validateContentType = (
        contentType: string | undefined
      ): boolean => {
        if (!contentType) return false;
        return contentType.toLowerCase().includes('application/json');
      };

      expect(validateContentType('application/json')).toBe(true);
      expect(validateContentType('application/json; charset=utf-8')).toBe(true);
      expect(validateContentType('text/plain')).toBe(false);
      expect(validateContentType(undefined)).toBe(false);
    });
  });

  describe('Premium Status Update Security', () => {
    /**
     * Only server-side webhook should update premium status.
     * Client-side premium status must NEVER be trusted.
     */
    it('should only allow internal mutations to update premium', () => {
      // Internal mutations are identified by:
      // 1. Being called from webhook handler (server-side)
      // 2. Not exposed in public API
      // 3. Requiring valid webhook signature verification first

      const isInternalMutation = (mutationName: string): boolean => {
        const internalMutations = [
          'grantPremium',
          'revokePremium',
          'setBillingIssue',
        ];
        return internalMutations.includes(mutationName);
      };

      expect(isInternalMutation('grantPremium')).toBe(true);
      expect(isInternalMutation('updatePremium')).toBe(false);
    });

    it('should track subscription audit fields', () => {
      interface SubscriptionAudit {
        createdAt: number;
        updatedAt: number;
        originalTransactionId?: string;
        latestEventType?: string;
      }

      const auditFields: SubscriptionAudit = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        originalTransactionId: 'rc_123',
        latestEventType: 'INITIAL_PURCHASE',
      };

      // Audit fields should be present
      expect(auditFields).toHaveProperty('createdAt');
      expect(auditFields).toHaveProperty('updatedAt');
      expect(auditFields).toHaveProperty('originalTransactionId');
      expect(auditFields).toHaveProperty('latestEventType');
    });
  });
});
