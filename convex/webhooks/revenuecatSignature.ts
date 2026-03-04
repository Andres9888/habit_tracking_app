/**
 * RevenueCat Webhook Signature Verification
 *
 * SEC-002: Ensures webhook requests are authentic and from RevenueCat
 *
 * RevenueCat sends an HMAC-SHA256 signature in the X-RevenueCat-Signature header.
 * We verify this by computing our own HMAC using the shared secret.
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks#signature-verification
 */

// The shared secret should be set in the Convex environment variables
// Note: Environment variables are accessed differently in Convex HTTP actions
const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? '';

// Allow bypassing signature verification in development.
// Set SKIP_WEBHOOK_VERIFICATION=true in your Convex dev environment variables.
// NODE_ENV is not reliable in Convex's runtime — use an explicit env var instead.
const isDevelopment = process.env.SKIP_WEBHOOK_VERIFICATION === 'true';

/**
 * Verifies that a webhook request came from RevenueCat
 *
 * @param body - The raw request body as a string
 * @param signature - The X-RevenueCat-Signature header value
 * @returns true if the signature is valid, false otherwise
 */
export async function verifyRevenueCatSignature(
  body: string,
  signature: string
): Promise<boolean> {
  // If no secret is configured, we must reject in production
  // SECURITY: Only allow bypass in explicit development mode
  if (!REVENUECAT_WEBHOOK_SECRET) {
    if (isDevelopment) {
      console.warn(
        '[RevenueCat] DEV MODE: No webhook secret configured, skipping verification'
      );
      return true;
    }
    console.error(
      '[RevenueCat] CRITICAL: No webhook secret configured in production - rejecting webhook'
    );
    return false;
  }

  if (!signature) {
    console.error('[RevenueCat] No signature provided');
    return false;
  }

  try {
    // Use Web Crypto API (available in Convex runtime)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(REVENUECAT_WEBHOOK_SECRET);
    const data = encoder.encode(body);

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
    return timingSafeEqual(computedSignature, signature);
  } catch (error) {
    console.error('[RevenueCat] Signature verification error:', error);
    return false;
  }
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
