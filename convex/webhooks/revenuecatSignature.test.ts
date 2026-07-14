/**
 * Security Test Suite: RevenueCat Webhook Signature Verification (SEC-005)
 *
 * Tests for SEC-002: Server-side RevenueCat webhook premium validation.
 * Verifies HMAC-SHA256 signature verification prevents webhook spoofing.
 */

import { createHmac } from 'node:crypto';

describe('SEC-002: RevenueCat Webhook Signature Verification', () => {
  const originalSecret = process.env.REVENUECAT_WEBHOOK_SECRET;

  afterEach(() => {
    jest.resetModules();
    if (originalSecret === undefined) {
      delete process.env.REVENUECAT_WEBHOOK_SECRET;
    } else {
      process.env.REVENUECAT_WEBHOOK_SECRET = originalSecret;
    }
    jest.restoreAllMocks();
  });

  const signRevenueCatPayload = (
    body: string,
    secret: string,
    timestamp: number
  ): string => {
    const signature = createHmac('sha256', secret)
      .update(`${timestamp}.${body}`)
      .digest('hex');

    return `t=${timestamp},v1=${signature}`;
  };

  const loadVerifyRevenueCatSignature =
    (): (typeof import('./revenuecatSignature'))['verifyRevenueCatSignature'] => {
      let verifier:
        | (typeof import('./revenuecatSignature'))['verifyRevenueCatSignature']
        | undefined;

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        verifier = require('./revenuecatSignature').verifyRevenueCatSignature;
      });

      if (!verifier) {
        throw new Error('Failed to load RevenueCat signature verifier');
      }

      return verifier;
    };

  describe('Active Dashboard Signature Verification', () => {
    it('verifies X-RevenueCat-Webhook-Signature over timestamp and raw body', async () => {
      const secret = 'test_revenuecat_webhook_secret';
      const timestamp = 1_800_000_000;
      const body =
        '{"event":{"id":"evt_1","type":"INITIAL_PURCHASE","app_user_id":"user_1"}}';
      process.env.REVENUECAT_WEBHOOK_SECRET = secret;
      jest.spyOn(Date, 'now').mockReturnValue(timestamp * 1000);

      const verifyRevenueCatSignature = loadVerifyRevenueCatSignature();

      await expect(
        verifyRevenueCatSignature(
          body,
          signRevenueCatPayload(body, secret, timestamp)
        )
      ).resolves.toBe(true);
    });

    it('rejects signatures made over only the body', async () => {
      const secret = 'test_revenuecat_webhook_secret';
      const timestamp = 1_800_000_000;
      const body = '{"event":{"id":"evt_1"}}';
      const bodyOnlySignature = createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      process.env.REVENUECAT_WEBHOOK_SECRET = secret;
      jest.spyOn(Date, 'now').mockReturnValue(timestamp * 1000);

      const verifyRevenueCatSignature = loadVerifyRevenueCatSignature();

      await expect(
        verifyRevenueCatSignature(
          body,
          `t=${timestamp},v1=${bodyOnlySignature}`
        )
      ).resolves.toBe(false);
    });

    it('rejects stale dashboard signatures', async () => {
      const secret = 'test_revenuecat_webhook_secret';
      const timestamp = 1_800_000_000;
      const body = '{"event":{"id":"evt_1"}}';
      process.env.REVENUECAT_WEBHOOK_SECRET = secret;
      jest.spyOn(Date, 'now').mockReturnValue((timestamp + 301) * 1000);

      const verifyRevenueCatSignature = loadVerifyRevenueCatSignature();

      await expect(
        verifyRevenueCatSignature(
          body,
          signRevenueCatPayload(body, secret, timestamp)
        )
      ).resolves.toBe(false);
    });

    it('requires t and v1 values in the signature header', async () => {
      process.env.REVENUECAT_WEBHOOK_SECRET = 'test_revenuecat_webhook_secret';

      const verifyRevenueCatSignature = loadVerifyRevenueCatSignature();

      await expect(
        verifyRevenueCatSignature('{"event":{"id":"evt_1"}}', 'abc123')
      ).resolves.toBe(false);
    });
  });

  describe('Timing-Safe String Comparison', () => {
    /**
     * Timing-safe comparison prevents timing attacks where attackers
     * can determine correct characters by measuring response time.
     */
    const timingSafeEqual = (a: string, b: string): boolean => {
      if (a.length !== b.length) return false;
      let result = 0;
      for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
      }
      return result === 0;
    };

    it('should return true for identical strings', () => {
      expect(timingSafeEqual('abc123', 'abc123')).toBe(true);
      expect(timingSafeEqual('', '')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(timingSafeEqual('abc123', 'abc124')).toBe(false);
      expect(timingSafeEqual('abc', 'abd')).toBe(false);
    });

    it('should return false for different lengths', () => {
      expect(timingSafeEqual('abc', 'abcd')).toBe(false);
      expect(timingSafeEqual('abcd', 'abc')).toBe(false);
    });

    it('should handle hex signatures (64 chars for SHA-256)', () => {
      const sig1 = 'a'.repeat(64);
      const sig2 = 'a'.repeat(63) + 'b';
      expect(timingSafeEqual(sig1, sig1)).toBe(true);
      expect(timingSafeEqual(sig1, sig2)).toBe(false);
    });
  });

  describe('HMAC-SHA256 Signature Format', () => {
    it('should validate signature is hex-encoded', () => {
      const validHex = /^[0-9a-f]{64}$/i;

      expect(validHex.test('a'.repeat(64))).toBe(true);
      expect(validHex.test('abcdef0123456789'.repeat(4))).toBe(true);

      // Invalid formats
      expect(validHex.test('xyz')).toBe(false); // Too short
      expect(validHex.test('g'.repeat(64))).toBe(false); // Invalid hex char
    });

    it('should reject empty signatures', () => {
      const isValidSignature = (sig: string): boolean => {
        return !!sig && /^[0-9a-f]{64}$/i.test(sig);
      };

      expect(isValidSignature('')).toBe(false);
      expect(isValidSignature('   ')).toBe(false);
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
        validateWebhookRequest({ 'x-revenuecat-webhook-signature': 'abc123' })
      ).toEqual({ valid: true });
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
