/**
 * useDeepLinking Hook
 *
 * Handles deep link URL parsing and routing for ChainDay.
 *
 * Supported URL formats:
 * - Custom scheme: habit-tracker://habit/{habitId}
 * - Custom scheme: habit-tracker://share/{shareId}
 * - Custom scheme: habit-tracker://referral/{code}
 * - Universal links: https://chainday.app/habit/{habitId}
 * - Universal links: https://chainday.app/share/{shareId}
 * - Universal links: https://chainday.app/referral/{code}
 *
 * Invalid or malformed deep links are logged and silently ignored
 * to prevent crashes.
 */

import { useEffect, useCallback, useRef } from 'react';
import * as Linking from 'expo-linking';
import * as Sentry from '@sentry/react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeepLinkRoute =
  | { type: 'habit'; habitId: string }
  | { type: 'share'; shareId: string }
  | { type: 'referral'; code: string }
  | { type: 'unknown'; url: string };

export interface DeepLinkHandlers {
  /** Navigate to a specific habit */
  onHabitLink?: (habitId: string) => void;
  /** Open a shared streak card */
  onShareLink?: (shareId: string) => void;
  /** Process a referral code */
  onReferralLink?: (code: string) => void;
}

// ---------------------------------------------------------------------------
// URL Parsing
// ---------------------------------------------------------------------------

/** Validate that a string looks like a reasonable ID (non-empty, no weird chars) */
function isValidId(value: string | undefined): value is string {
  if (!value || typeof value !== 'string') return false;
  // Allow alphanumeric, hyphens, underscores (typical Convex/UUID ids)
  return /^[\w-]{1,128}$/.test(value);
}

/**
 * Parse a deep link URL into a structured route.
 * Returns `null` for URLs that aren't deep links (e.g. OAuth callbacks).
 */
export function parseDeepLink(url: string): DeepLinkRoute | null {
  try {
    const parsed = Linking.parse(url);
    const path = parsed.path?.replace(/^\/+/, '').replace(/\/+$/, '') ?? '';
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) {
      // Root URL — not a deep link action, just app open
      return null;
    }

    const [route, id] = segments;

    switch (route) {
      case 'habit':
        if (isValidId(id)) return { type: 'habit', habitId: id };
        break;
      case 'share':
        if (isValidId(id)) return { type: 'share', shareId: id };
        break;
      case 'referral':
        if (isValidId(id)) return { type: 'referral', code: id };
        break;
    }

    // Unrecognised or malformed — return as unknown so callers can log
    return { type: 'unknown', url };
  } catch {
    // Truly malformed URL — don't crash
    if (__DEV__) {
      console.warn('[DeepLink] Failed to parse URL:', url);
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Subscribe to incoming deep links and route them to handlers.
 *
 * Handles both:
 * - Cold start (app opened via deep link)
 * - Warm resume (deep link while app is running)
 *
 * All errors are caught and reported to Sentry — the app never crashes
 * from a bad deep link.
 */
export function useDeepLinking(handlers: DeepLinkHandlers) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleUrl = useCallback((url: string) => {
    // Skip OAuth callback URLs — those are handled by Clerk
    if (url.includes('oauth') || url.includes('clerk')) {
      return;
    }

    try {
      const route = parseDeepLink(url);
      if (!route) return;

      switch (route.type) {
        case 'habit':
          handlersRef.current.onHabitLink?.(route.habitId);
          break;
        case 'share':
          handlersRef.current.onShareLink?.(route.shareId);
          break;
        case 'referral':
          handlersRef.current.onReferralLink?.(route.code);
          break;
        case 'unknown':
          // Log unknown deep links for monitoring
          Sentry.addBreadcrumb({
            category: 'deep-link',
            message: `Unknown deep link: ${route.url}`,
            level: 'warning',
          });
          break;
      }
    } catch (error) {
      // Never crash from deep link handling
      Sentry.captureException(error, {
        tags: { component: 'deep-link' },
        extra: { url },
      });
      if (__DEV__) {
        console.error('[DeepLink] Error handling URL:', url, error);
      }
    }
  }, []);

  useEffect(() => {
    // Handle cold start — check if app was opened via a URL
    void Linking.getInitialURL()
      .then((url) => {
        if (url) handleUrl(url);
      })
      .catch((error) => {
        if (__DEV__) {
          console.warn('[DeepLink] Error getting initial URL:', error);
        }
      });

    // Handle warm resume — listen for URLs while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);
}

export default useDeepLinking;
