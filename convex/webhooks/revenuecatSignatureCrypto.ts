const REVENUECAT_SIGNATURE_HEX_LENGTH = 64;

export async function computeRevenueCatSignatureHex(
  payload: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  return bytesToHex(new Uint8Array(signatureBytes));
}

/** Compare fixed-format signature bytes without content-dependent early exit. */
export function timingSafeEqualHex(a: string, b: string): boolean {
  const aBytes = hexToBytes(a);
  const bBytes = hexToBytes(b);
  if (!aBytes || !bBytes) return false;

  const len = Math.max(aBytes.length, bBytes.length);
  let result = aBytes.length ^ bBytes.length;
  for (let index = 0; index < len; index += 1) {
    result |= (aBytes[index] ?? 0) ^ (bBytes[index] ?? 0);
  }
  return result === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

function hexToBytes(hex: string): Uint8Array | undefined {
  if (!isValidRevenueCatSignatureHex(hex)) return undefined;

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }
  return bytes;
}

export function isValidRevenueCatSignatureHex(value: string): boolean {
  return (
    value.length === REVENUECAT_SIGNATURE_HEX_LENGTH &&
    /^[0-9a-f]+$/i.test(value)
  );
}
