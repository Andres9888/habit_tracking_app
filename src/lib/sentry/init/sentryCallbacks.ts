/**
 * Sentry Callback Functions
 * Event processing callbacks for Sentry initialization.
 */

import type { ErrorEvent } from '@sentry/react-native';
import type { SentryConfig } from '../types';

type UnknownRecord = Record<string, unknown>;
type Breadcrumb = { category?: string; data?: { url?: string } };

/**
 * Substrings (case-insensitive) that mark a key as sensitive. If a key
 * in any data/header/extra/context bag contains any of these substrings,
 * its value is replaced with '[redacted]' before the event is sent.
 *
 * SR-2026-04-17-06. The previous allowlist only dropped three exact
 * keys (token/accessToken/refreshToken), which let names like
 * `authorization`, `apiKey`, `secret`, and `email` through.
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

/** Return a shallow copy of `record` with sensitive keys redacted. */
function scrubRecord(record: UnknownRecord | undefined): UnknownRecord | undefined {
  if (!record) return record;
  const safe: UnknownRecord = {};
  for (const key of Object.keys(record)) {
    safe[key] = isSensitiveKey(key) ? '[redacted]' : record[key];
  }
  return safe;
}

/** Process event before sending - redact sensitive data */
export function createBeforeSend(config: SentryConfig) {
  return function beforeSend(event: ErrorEvent): ErrorEvent | null {
    // Don't send in development unless explicitly enabled
    if (__DEV__ && !config.debug) {
      return null;
    }

    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          breadcrumb.data = scrubRecord(breadcrumb.data as UnknownRecord);
        }
        return breadcrumb;
      });
    }

    if (event.extra) {
      event.extra = scrubRecord(event.extra as UnknownRecord);
    }

    if (event.contexts) {
      const safeContexts: Record<string, UnknownRecord | undefined> = {};
      for (const [contextKey, contextValue] of Object.entries(event.contexts)) {
        safeContexts[contextKey] = scrubRecord(contextValue as UnknownRecord);
      }
      event.contexts = safeContexts as ErrorEvent['contexts'];
    }

    if (event.request?.headers) {
      event.request.headers = scrubRecord(
        event.request.headers as UnknownRecord
      ) as Record<string, string>;
    }

    return event;
  };
}

/** Process breadcrumb before adding - filter noisy requests */
export function beforeBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  // Skip verbose network requests
  if (breadcrumb.category === 'xhr' && breadcrumb.data?.url) {
    const url = String(breadcrumb.data.url);
    // Skip health checks and polling
    if (url.includes('/health') || url.includes('/poll')) {
      return null;
    }
  }
  return breadcrumb;
}
