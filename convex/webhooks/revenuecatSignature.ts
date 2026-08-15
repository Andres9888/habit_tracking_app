/**
 * RevenueCat Webhook Signature Verification
 *
 * SEC-002: Ensures webhook requests are authentic and from RevenueCat
 *
 * RevenueCat sends an HMAC-SHA256 signature in the
 * X-RevenueCat-Webhook-Signature header as:
 *   t=<unix_timestamp>,v1=<hmac_sha256_hex>
 * We verify this by computing HMAC-SHA256 over:
 *   <timestamp>.<raw_json_body>
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks#signature-verification
 */

import {
  computeRevenueCatSignatureHex,
  timingSafeEqualHex,
} from './revenuecatSignatureCrypto';
import { parseRevenueCatSignatureHeader } from './parseRevenueCatSignatureHeader';

export const REVENUECAT_WEBHOOK_SIGNATURE_HEADER =
  'X-RevenueCat-Webhook-Signature';
export const DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS = 300;

export interface RevenueCatSignatureVerifierOptions {
  currentUnixTimestampSeconds?: number;
  env?: Readonly<Record<string, string | undefined>>;
  secret?: string;
  toleranceSeconds?: number;
}

interface RevenueCatVerificationContext {
  currentUnixTimestampSeconds: number;
  secret: string;
  toleranceSeconds: number;
}

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
  options: RevenueCatSignatureVerifierOptions = {}
): Promise<boolean> {
  try {
    const parsedHeader = parseRevenueCatSignatureHeader(signatureHeader);
    if (!parsedHeader) {
      console.error('[RevenueCat] Invalid webhook signature header');
      return false;
    }

    const context = resolveVerificationContext(options);
    if (!context) return false;
    if (!isTimestampFresh(parsedHeader.timestamp, context)) {
      console.error('[RevenueCat] Webhook signature timestamp outside tolerance');
      return false;
    }

    const signedPayload = `${parsedHeader.timestamp}.${body}`;
    const computedSignature = await computeRevenueCatSignatureHex(
      signedPayload,
      context.secret
    );

    return timingSafeEqualHex(computedSignature, parsedHeader.signatureHex);
  } catch (error) {
    console.error('[RevenueCat] Signature verification error:', error);
    return false;
  }
}

function resolveVerificationContext(
  options: RevenueCatSignatureVerifierOptions
): RevenueCatVerificationContext | undefined {
  const secret = resolveRevenueCatWebhookSecret(options);
  if (!secret) {
    console.error(
      '[RevenueCat] CRITICAL: No webhook secret configured - rejecting webhook'
    );
    return undefined;
  }

  const toleranceSeconds =
    options.toleranceSeconds ?? DEFAULT_REVENUECAT_WEBHOOK_TOLERANCE_SECONDS;
  const currentUnixTimestampSeconds =
    options.currentUnixTimestampSeconds ?? Math.floor(Date.now() / 1000);
  if (!Number.isInteger(toleranceSeconds) || toleranceSeconds < 0) {
    console.error('[RevenueCat] Invalid webhook signature tolerance');
    return undefined;
  }
  if (!Number.isInteger(currentUnixTimestampSeconds)) {
    console.error('[RevenueCat] Invalid current time for signature verification');
    return undefined;
  }
  return { currentUnixTimestampSeconds, secret, toleranceSeconds };
}

function isTimestampFresh(
  timestamp: number,
  context: RevenueCatVerificationContext
): boolean {
  return (
    Math.abs(context.currentUnixTimestampSeconds - timestamp) <=
    context.toleranceSeconds
  );
}

function resolveRevenueCatWebhookSecret(
  options: RevenueCatSignatureVerifierOptions
): string | undefined {
  if (typeof options.secret === 'string') {
    return options.secret.length > 0 ? options.secret : undefined;
  }

  const env = options.env ?? process.env;
  const secret = env.REVENUECAT_WEBHOOK_SECRET;
  return typeof secret === 'string' && secret.length > 0 ? secret : undefined;
}
