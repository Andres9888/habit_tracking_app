/**
 * Analytics Hooks
 * 
 * React hooks for analytics integration
 */

import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus } from 'react-native';
import {
  parseDeepLink,
  storeDeepLinkAttribution,
  startSession,
  endSession,
  trackScreen,
} from './index';
import type { DeepLinkEvent } from './types';

/**
 * Hook to track deep links and attribution
 */
export function useDeepLinkTracking() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Handle initial URL (app opened via deep link)
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          const deepLinkEvent = parseDeepLink(url);
          storeDeepLinkAttribution(deepLinkEvent);
          startSession(deepLinkEvent);
        } else {
          startSession();
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.error('[DeepLink] Failed to get initial URL:', error);
        }
        startSession();
      });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const deepLinkEvent = parseDeepLink(url);
      storeDeepLinkAttribution(deepLinkEvent);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

/**
 * Hook to track app lifecycle and session management
 */
export function useAppLifecycleTracking() {
  const appState = useRef(AppState.currentState);
  const sessionEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App foregrounded
          if (sessionEndTimer.current) {
            clearTimeout(sessionEndTimer.current);
            sessionEndTimer.current = null;
          }

          // Check if we need to start a new session
          // (session was ended or never started)
          startSession();
        } else if (
          appState.current === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          // App backgrounded - schedule session end after 30 seconds
          sessionEndTimer.current = setTimeout(() => {
            endSession();
          }, 30000);
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
      if (sessionEndTimer.current) {
        clearTimeout(sessionEndTimer.current);
      }
      endSession();
    };
  }, []);
}

/**
 * Hook to track screen views
 */
export function useScreenTracking(
  screenName: string,
  properties?: Record<string, unknown>
) {
  useEffect(() => {
    trackScreen(screenName, properties);
  }, [screenName, properties]);
}

/**
 * Combined analytics initialization hook
 * Use this in your root App component
 */
export function useAnalytics() {
  useDeepLinkTracking();
  useAppLifecycleTracking();

  return {
    trackScreen,
    // Add other analytics methods as needed
  };
}

/**
 * Hook to track time spent on screen
 */
export function useScreenTimeTracking(screenName: string) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const duration = Date.now() - startTime.current;
      trackScreen(`${screenName}_duration`, { duration });
    };
  }, [screenName]);
}
