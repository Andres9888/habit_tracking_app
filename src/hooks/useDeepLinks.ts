/**
 * useDeepLinks - Deep link handler for habit-tracker:// and universal links
 *
 * Supports routes:
 * - /habit/:id   → open habit detail
 * - /toggle/:id  → quick-complete a habit
 * - /settings    → open settings modal
 * - /premium     → open premium/paywall screen
 *
 * Works with both custom scheme (habit-tracker://) and
 * universal links (https://chainday.app/...)
 */

import { useCallback, useEffect, useRef } from 'react';
import { Linking, Platform } from 'react-native';

/** Parsed deep link with route and params */
export interface DeepLinkRoute {
  path: 'habit' | 'toggle' | 'settings' | 'premium' | 'unknown';
  habitId?: string;
  raw: string;
}

/**
 * Parse a deep link URL into a structured route.
 *
 * Handles:
 *   habit-tracker://habit/abc123
 *   habit-tracker://toggle/abc123
 *   habit-tracker://settings
 *   habit-tracker://premium
 *   https://chainday.app/habit/abc123
 *   https://chainday.app/toggle/abc123
 *   https://chainday.app/settings
 *   https://chainday.app/premium
 */
export function parseDeepLink(url: string): DeepLinkRoute {
  try {
    // Normalize: strip scheme and host for both custom and universal
    let pathname = '';

    if (url.startsWith('habit-tracker://')) {
      // Custom scheme: habit-tracker://habit/abc → pathname = /habit/abc
      pathname = '/' + url.replace('habit-tracker://', '');
    } else {
      // Universal link: https://chainday.app/habit/abc
      const parsed = new URL(url);
      pathname = parsed.pathname;
    }

    // Clean up trailing slashes and whitespace
    pathname = pathname.replace(/\/+$/, '').trim();

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0]?.toLowerCase();

    switch (firstSegment) {
      case 'habit':
        return { path: 'habit', habitId: segments[1], raw: url };
      case 'toggle':
        return { path: 'toggle', habitId: segments[1], raw: url };
      case 'settings':
        return { path: 'settings', raw: url };
      case 'premium':
        return { path: 'premium', raw: url };
      default:
        return { path: 'unknown', raw: url };
    }
  } catch {
    return { path: 'unknown', raw: url };
  }
}

export interface DeepLinkHandlers {
  onOpenHabit?: (habitId: string) => void;
  onToggleHabit?: (habitId: string) => void;
  onOpenSettings?: () => void;
  onOpenPremium?: () => void;
}

/**
 * Subscribe to deep links (both cold-start and foreground).
 * Call this once at the top level of your authenticated app tree.
 */
export function useDeepLinks(handlers: DeepLinkHandlers): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const handleUrl = useCallback((url: string | null) => {
    if (!url) return;

    const route = parseDeepLink(url);
    const h = handlersRef.current;

    switch (route.path) {
      case 'habit':
        if (route.habitId && h.onOpenHabit) {
          h.onOpenHabit(route.habitId);
        }
        break;
      case 'toggle':
        if (route.habitId && h.onToggleHabit) {
          h.onToggleHabit(route.habitId);
        }
        break;
      case 'settings':
        h.onOpenSettings?.();
        break;
      case 'premium':
        h.onOpenPremium?.();
        break;
      default:
        // Unknown route — silently ignore
        break;
    }
  }, []);

  useEffect(() => {
    // Handle cold-start deep link
    void Linking.getInitialURL().then(handleUrl);

    // Handle foreground deep links
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);
}
