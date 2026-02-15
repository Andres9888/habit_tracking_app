/**
 * Sentry Callback Functions
 * Event processing callbacks for Sentry initialization.
 */

import type { ErrorEvent } from '@sentry/react-native';
import type { SentryConfig } from '../types';

type BreadcrumbData = Record<string, unknown>;
type Breadcrumb = { category?: string; data?: { url?: string } };

/** Process event before sending - redact sensitive data */
export function createBeforeSend(config: SentryConfig) {
  return function beforeSend(event: ErrorEvent): ErrorEvent | null {
    // Don't send in development unless explicitly enabled
    if (__DEV__ && !config.debug) {
      return null;
    }

    // Redact sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          // Remove any token or auth data - use explicit ignore pattern
          const data = breadcrumb.data;
          const safeData: BreadcrumbData = {};
          for (const key of Object.keys(data)) {
            if (!['token', 'accessToken', 'refreshToken'].includes(key)) {
              safeData[key] = data[key];
            }
          }
          breadcrumb.data = safeData;
        }
        return breadcrumb;
      });
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
