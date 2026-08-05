/**
 * Sentry data-scrubbing helpers.
 *
 * Redacts secrets/PII before an event leaves the device for Sentry (a durable
 * third party). Matches both sensitive key NAMES and secret-shaped VALUES, and
 * recurses into nested objects/arrays so a secret buried inside `event.extra`,
 * `breadcrumb.data`, or `request.data` can't slip through.
 */

export type UnknownRecord = Record<string, unknown>;

/**
 * Substrings (case-insensitive) that mark a key as sensitive. If a key in any
 * bag contains any of these substrings, its value becomes '[redacted]'.
 * SR-2026-04-17-06.
 */
const SENSITIVE_KEY_PATTERNS = [
  'token',
  'secret',
  'password',
  'passwd',
  'auth',
  'cookie',
  'session',
  'credential',
  'apikey',
  'api_key',
  'email',
  'clerk_',
  'jwt',
  'bearer',
] as const;

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Value shapes that look like secrets regardless of key name: bearer tokens,
 * JWTs, prefixed API keys, and long hex blobs.
 */
const SENSITIVE_VALUE_PATTERNS: RegExp[] = [
  /\bBearer\s+[\w.~+/-]+=*/i,
  /\beyJ[\w-]{10,}\.[\w-]{5,}\.[\w-]{5,}\b/, // JWT
  /\b(?:sk|pk|rk|whsec|appl)_(?:live_|test_)?[\w-]{8,}\b/i, // prefixed API keys
  /\b[0-9a-f]{32,}\b/i, // long hex blob
];

// Cap recursion so a pathologically nested (or self-referential) bag can't
// stall event submission. Real Sentry payloads are shallow.
const MAX_SCRUB_DEPTH = 6;

function scrubValue(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') {
    return SENSITIVE_VALUE_PATTERNS.some((pattern) => pattern.test(value))
      ? '[redacted]'
      : value;
  }
  if (value === null || typeof value !== 'object' || depth >= MAX_SCRUB_DEPTH) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item, depth + 1));
  }
  return scrubRecord(value as UnknownRecord, depth + 1);
}

/**
 * Global twins of the value patterns for in-place substring replacement.
 * Kept separate because a /g regex is stateful under .test() (lastIndex).
 */
const SENSITIVE_VALUE_PATTERNS_GLOBAL = SENSITIVE_VALUE_PATTERNS.map(
  (pattern) => new RegExp(pattern.source, `${pattern.flags}g`)
);

/**
 * Redact secret-shaped substrings inside free text (error messages), keeping
 * the rest intact — whole-value redaction would destroy debugging signal.
 */
export function scrubText(text: string): string {
  let result = text;
  for (const pattern of SENSITIVE_VALUE_PATTERNS_GLOBAL) {
    result = result.replace(pattern, '[redacted]');
  }
  return result;
}

/** Deep copy of `record` with sensitive keys and values redacted. */
export function scrubRecord(
  record: UnknownRecord | undefined,
  depth = 0
): UnknownRecord | undefined {
  if (!record) return record;
  const safe: UnknownRecord = {};
  for (const key of Object.keys(record)) {
    safe[key] = isSensitiveKey(key)
      ? '[redacted]'
      : scrubValue(record[key], depth);
  }
  return safe;
}
