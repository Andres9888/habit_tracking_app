/**
 * RevenueCat Webhook Signature Verification
 *
 * SEC-002: Ensures webhook requests are authentic and from RevenueCat
 *
 * RevenueCat sends an HMAC-SHA256 signature in the
 * X-RevenueCat-Webhook-Signature header:
 *
 *   t=<unix_timestamp>,v1=<hmac_sha256_hex>
 *
 * We verify this by computing our own HMAC over "<timestamp>.<raw body>" using
 * the shared secret.
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks#signature-verification
 */

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;
const WEBHOOK_SIGNATURE_PATTERN = /^[0-9a-f]{64}$/i;

function getWebhookSecret(): string {
  // The shared secret should be set in the Convex environment variables.
  return process.env.REVENUECAT_WEBHOOK_SECRET ?? '';
}

/**
 * Verifies that a webhook request came from RevenueCat
 *
 * @param rawBody - The raw request body bytes
 * @param signatureHeader - The X-RevenueCat-Webhook-Signature header value
 * @returns true if the signature is valid, false otherwise
 */
export async function verifyRevenueCatSignature(
  rawBody: Uint8Array,
  signatureHeader: string
): Promise<boolean> {
  // SECURITY: Reject all webhooks when secret is missing.
  // This prevents accidental signature-bypass configuration from reaching production.
  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    console.error(
      '[RevenueCat] CRITICAL: No webhook secret configured - rejecting webhook'
    );
    return false;
  }

  if (!signatureHeader) {
    console.error('[RevenueCat] No signature provided');
    return false;
  }

  try {
    const parsedSignature = parseRevenueCatSignatureHeader(signatureHeader);
    if (!parsedSignature) {
      console.error('[RevenueCat] Invalid signature header format');
      return false;
    }

    const { timestamp, v1 } = parsedSignature;
    if (isStaleTimestamp(timestamp)) {
      console.error('[RevenueCat] Stale webhook signature timestamp');
      return false;
    }

    // Use Web Crypto API (available in Convex runtime)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
    const prefix = encoder.encode(timestamp + '.');
    const data = new Uint8Array(prefix.length + rawBody.length);
    data.set(prefix);
    data.set(rawBody, prefix.length);

    // Import the secret key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { hash: 'SHA-256', name: 'HMAC' },
      false,
      ['sign']
    );

    // Compute the HMAC
    const signatureBytes = await crypto.subtle.sign('HMAC', key, data);

    // Convert to hex string
    const computedSignature = [...new Uint8Array(signatureBytes)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Compare signatures (timing-safe comparison)
    return timingSafeEqual(computedSignature, v1);
  } catch (error) {
    console.error('[RevenueCat] Signature verification error:', error);
    return false;
  }
}

function parseRevenueCatSignatureHeader(
  signatureHeader: string
): { timestamp: string; v1: string } | undefined {
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [key, value] = part.trim().split('=', 2);
      return [key, value];
    })
  );

  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1 || !WEBHOOK_SIGNATURE_PATTERN.test(v1)) {
    return undefined;
  }

  return { timestamp, v1 };
}

function isStaleTimestamp(timestamp: string): boolean {
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    return true;
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  return ageSeconds > SIGNATURE_TOLERANCE_SECONDS;
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Avoids early exit on length mismatch so comparison time is constant.
 * HMAC-SHA256 hex is always 64 chars, so length differs only for malformed input.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let result = a.length ^ b.length; // Non-zero if lengths differ
  for (let i = 0; i < len; i++) {
    result |= (a.codePointAt(i) || 0) ^ (b.codePointAt(i) || 0);
  }
  return result === 0;
}
