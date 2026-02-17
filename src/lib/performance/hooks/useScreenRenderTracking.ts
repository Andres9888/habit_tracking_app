/**
 * useScreenRenderTracking - Hook for tracking screen render performance
 */

import { useEffect, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { getPerformanceMonitor } from '../PerformanceMonitor';

/**
 * Track screen render performance automatically
 *
 * @param screenName - Unique name for the screen
 * @param deps - Dependencies that trigger re-renders
 *
 * @example
 * ```tsx
 * function HomeScreen() {
 *   useScreenRenderTracking('HomeScreen');
 *   // ... rest of component
 * }
 * ```
 */
export function useScreenRenderTracking(
  screenName: string,
  deps: unknown[] = []
): void {
  useEffect(() => {
    const monitor = getPerformanceMonitor();
    monitor.startScreenRender(screenName);

    // Mark as interactive after all interactions complete
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      monitor.markScreenInteractive(screenName);
    });

    return () => {
      interactionHandle.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenName, ...deps]);
}

/**
 * Get manual render tracking controls
 * Use when you need fine-grained control over when to mark screen as interactive
 *
 * @param screenName - Unique name for the screen
 *
 * @example
 * ```tsx
 * function ComplexScreen() {
 *   const { markInteractive } = useScreenRenderTrackingManual('ComplexScreen');
 *
 *   useEffect(() => {
 *     // After data loads and UI is ready
 *     if (dataLoaded) {
 *       markInteractive();
 *     }
 *   }, [dataLoaded, markInteractive]);
 * }
 * ```
 */
export function useScreenRenderTrackingManual(screenName: string): {
  markInteractive: () => void;
} {
  useEffect(() => {
    const monitor = getPerformanceMonitor();
    monitor.startScreenRender(screenName);
  }, [screenName]);

  const markInteractive = useCallback(() => {
    const monitor = getPerformanceMonitor();
    monitor.markScreenInteractive(screenName);
  }, [screenName]);

  return { markInteractive };
}
