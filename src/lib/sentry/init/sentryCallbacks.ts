/**
 * Sentry Callback Functions
 * Event processing callbacks for Sentry initialization.
 * Redaction logic lives in ./sentryScrub.
 */

import type { ErrorEvent } from '@sentry/react-native';
import type { SentryConfig } from '../types';
import { scrubRecord, scrubText, type UnknownRecord } from './sentryScrub';

type Breadcrumb = { category?: string; data?: { url?: string } };

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
        // Sentry's default console/fetch/xhr integrations auto-generate
        // breadcrumbs whose `message` carries logged text and URLs — scrub it
        // too, not just `data`.
        if (typeof breadcrumb.message === 'string') {
          breadcrumb.message = scrubText(breadcrumb.message);
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

    if (event.request?.data) {
      event.request.data =
        typeof event.request.data === 'string'
          ? scrubText(event.request.data)
          : scrubRecord(event.request.data as UnknownRecord);
    }

    // Error messages are the most common secret channel — a thrown
    // `Error('auth failed for Bearer …')` lands here, not in breadcrumbs.
    if (event.message) {
      event.message = scrubText(event.message);
    }

    if (event.exception?.values) {
      for (const exception of event.exception.values) {
        if (typeof exception.value === 'string') {
          exception.value = scrubText(exception.value);
        }
      }
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
