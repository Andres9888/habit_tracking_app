/**
 * AppHealthMonitor - Reports session health when app goes to background
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { getPerformanceMonitor } from '@/lib/performance';

/**
 * Monitors app state and reports health metrics when app goes to background
 * Add this component near the root of your app tree
 */
export function AppHealthMonitor(): null {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // App is going to background
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        try {
          const monitor = getPerformanceMonitor();
          monitor.reportSessionHealth();
        } catch (error) {
          if (__DEV__) {
            console.error('[AppHealthMonitor] Failed to report session health:', error);
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
