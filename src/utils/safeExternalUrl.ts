/**
 * External link validation.
 *
 * Purpose:
 * - Prevent known dangerous URL schemes (javascript:, vbscript:, data:)
 * - Keep behavior permissive for expected web links while avoiding obvious injection vectors
 */

const BLOCKED_SCHEMES = ['javascript:', 'vbscript:', 'data:'];

export function isSafeExternalUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const raw = value.trim();
  if (!raw) return false;

  // Reject control characters that can create parser ambiguity
  if (/[^\u0020-\u007E]/.test(raw)) return false;

  try {
    const parsed = new URL(raw);
    const scheme = parsed.protocol.toLowerCase();
    return !BLOCKED_SCHEMES.includes(scheme);
  } catch {
    return false;
  }
}

