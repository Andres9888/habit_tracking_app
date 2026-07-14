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
 * The signed payload is "<timestamp>.<raw request body>". Keep verification on
 * the raw body bytes/string read from Request.text(); parsing and re-stringifying
 * JSON changes the signed payload.
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks#signature-verification
 */

// The shared secret should be set in the Convex environment variables
const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? '';
const DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 300;
const SHA256_HEX_LENGTH = 64;

/**
 * Verifies that a webhook request came from RevenueCat
 *
 * @param body - The raw request body as a string
 * @param signatureHeader - The X-RevenueCat-Webhook-Signature header value
 * @returns true if the signature is valid, false otherwise
 */
export async function verifyRevenueCatSignature(
  body: string,
  signatureHeader: string,
  toleranceSeconds = DEFAULT_SIGNATURE_TOLERANCE_SECONDS
): Promise<boolean> {
  // SECURITY: Reject all webhooks when secret is missing.
  // This prevents accidental signature-bypass configuration from reaching production.
  if (!REVENUECAT_WEBHOOK_SECRET) {
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
      console.error('[RevenueCat] Malformed signature header');
      return false;
    }

    if (
      isStaleSignatureTimestamp(parsedSignature.timestamp, toleranceSeconds)
    ) {
      console.error('[RevenueCat] Stale signature timestamp');
      return false;
    }

    // Use Web Crypto API (available in Convex runtime)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(REVENUECAT_WEBHOOK_SECRET);
    const data = encoder.encode(`${parsedSignature.timestamp}.${body}`);

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
    return timingSafeEqual(computedSignature, parsedSignature.signature);
  } catch (error) {
    console.error('[RevenueCat] Signature verification error:', error);
    return false;
  }
}

function parseRevenueCatSignatureHeader(
  header: string
): { signature: string; timestamp: string } | undefined {
  const parts = new Map<string, string>();
  for (const rawPart of header.split(',')) {
    const [rawKey, rawValue] = rawPart.split('=', 2);
    const key = rawKey?.trim();
    const value = rawValue?.trim();
    if (key && value) {
      parts.set(key, value);
    }
  }

  const timestamp = parts.get('t');
  const signature = parts.get('v1');
  if (!timestamp || !signature) {
    return undefined;
  }

  if (
    !/^\d+$/.test(timestamp) ||
    signature.length !== SHA256_HEX_LENGTH ||
    !/^[0-9a-f]+$/i.test(signature)
  ) {
    return undefined;
  }

  return { signature, timestamp };
}

function isStaleSignatureTimestamp(
  timestamp: string,
  toleranceSeconds: number
): boolean {
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    return true;
  }

  const nowSeconds = Date.now() / 1000;
  return Math.abs(nowSeconds - timestampSeconds) > toleranceSeconds;
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
