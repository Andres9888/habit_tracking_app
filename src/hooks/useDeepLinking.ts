/**
 * useDeepLinking Hook
 *
 * Handles deep linking for the ChainDay app.
 * Supports routes:
 * - chainday://habit/:id - Open habit detail screen
 * - chainday://analytics - Open analytics screen
 * - chainday://settings - Open settings modal
 *
 * This hook should be mounted at the app root level after authentication.
 */

import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import type { Id } from '../../convex/_generated/dataModel';

export interface DeepLinkHandlers {
  onOpenHabitDetail?: (habitId: Id<'habits'>) => void;
  onOpenAnalytics?: () => void;
  onOpenSettings?: () => void;
}

interface ParsedDeepLink {
  type: 'habit' | 'analytics' | 'settings' | 'unknown';
  habitId?: string;
}

/**
 * Parse a deep link URL into a typed route object
 */
function parseDeepLink(url: string): ParsedDeepLink {
  try {
    const parsed = Linking.parse(url);
    const { hostname, path, queryParams } = parsed;

    // Handle chainday://habit/123 or chainday://habit?id=123
    if (hostname === 'habit' || path === 'habit') {
      const habitId = path?.split('/')[1] || queryParams?.id;
      if (habitId && typeof habitId === 'string') {
        return { type: 'habit', habitId };
      }
    }

    // Handle chainday://analytics
    if (hostname === 'analytics' || path === 'analytics') {
      return { type: 'analytics' };
    }

    // Handle chainday://settings
    if (hostname === 'settings' || path === 'settings') {
      return { type: 'settings' };
    }

    return { type: 'unknown' };
  } catch {
    return { type: 'unknown' };
  }
}

/**
 * Handle a parsed deep link by calling the appropriate handler
 */
function handleDeepLink(
  parsed: ParsedDeepLink,
  handlers: DeepLinkHandlers
): void {
  switch (parsed.type) {
    case 'habit':
      if (parsed.habitId && handlers.onOpenHabitDetail) {
        handlers.onOpenHabitDetail(parsed.habitId as Id<'habits'>);
      }
      break;
    case 'analytics':
      if (handlers.onOpenAnalytics) {
        handlers.onOpenAnalytics();
      }
      break;
    case 'settings':
      if (handlers.onOpenSettings) {
        handlers.onOpenSettings();
      }
      break;
    case 'unknown':
      // Silently ignore unknown routes
      if (__DEV__) {
        console.log('[DeepLink] Unknown route, ignoring');
      }
      break;
  }
}

/**
 * Hook to enable deep linking support
 * Must be called after authentication is complete
 */
export function useDeepLinking(handlers: DeepLinkHandlers): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    // Handle initial URL if app was opened from a deep link
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          const parsed = parseDeepLink(url);
          handleDeepLink(parsed, handlersRef.current);
        }
      })
      .catch((error: unknown) => {
        if (__DEV__) {
          console.error('[DeepLink] Error getting initial URL:', error);
        }
      });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed = parseDeepLink(url);
      handleDeepLink(parsed, handlersRef.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
