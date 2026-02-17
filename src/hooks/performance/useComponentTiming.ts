/**
 * useComponentTiming Hook
 * Measure component mount/unmount lifecycle timing.
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePerformance } from './usePerformance';

interface TimingResult {
  lifetime: number | null;
  mountTime: number | null;
}

/**
 * Hook to measure component lifecycle timing for performance monitoring.
 * Tracks mount time (time to first paint) and total lifetime (mount to unmount).
 *
 * @description
 * Uses Performance API to capture precise timing metrics:
 * - mountTime: Time from component mount to first render completion
 * - lifetime: Total time component was mounted (available at unmount)
 *
 * @param componentName - Unique identifier for the component being measured
 * @returns Object containing timing metrics
 * @returns returns.mountTime - Milliseconds from mount to ready (null until measured)
 * @returns returns.lifetime - Milliseconds component was alive (null until unmount)
 *
 * @example
 * ```tsx
 * function HeavyComponent() {
 *   const { mountTime, lifetime } = useComponentTiming('HeavyComponent');
 *
 *   useEffect(() => {
 *     if (mountTime) {
 *       console.log(`Mounted in ${mountTime}ms`);
 *     }
 *   }, [mountTime]);
 *
 *   return <View>...</View>;
 * }
 * ```
 */
export function useComponentTiming(componentName: string): TimingResult {
  const { mark, measure } = usePerformance();
  const timingRef = useRef<TimingResult>({ lifetime: null, mountTime: null });
  const mountMarkName = `${componentName}:mount`;
  const readyMarkName = `${componentName}:ready`;

  useEffect(() => {
    const timing = timingRef.current;
    mark(mountMarkName);

    const frameId = requestAnimationFrame(() => {
      mark(readyMarkName);
      timing.mountTime = measure(
        `${componentName}:mount-time`,
        mountMarkName,
        readyMarkName
      );
    });

    return () => {
      cancelAnimationFrame(frameId);
      timing.lifetime = measure(`${componentName}:lifetime`, mountMarkName);
    };
  }, [componentName, mark, measure, mountMarkName, readyMarkName]);

  return timingRef.current;
}

/**
 * Hook to measure time between two points in a component.
 * Returns a function that starts a timer and returns a stop function.
 *
 * @description
 * Useful for measuring async operations, user interactions, or expensive computations.
 * Each call creates a unique measurement instance.
 *
 * @param operationName - Name of the operation being timed
 * @returns Start function that returns a stop function
 *
 * @example
 * ```tsx
 * function DataLoader() {
 *   const startTiming = useTiming('data-fetch');
 *
 *   const loadData = async () => {
 *     const stopTiming = startTiming();
 *     await fetchData();
 *     const duration = stopTiming();
 *     console.log(`Fetch took ${duration}ms`);
 *   };
 *
 *   return <Button onPress={loadData}>Load</Button>;
 * }
 * ```
 */
export function useTiming(operationName: string) {
  const { mark, measure } = usePerformance();
  const counterRef = useRef(0);

  return useCallback(() => {
    const id = ++counterRef.current;
    const startMarkName = `${operationName}:${id}:start`;
    const endMarkName = `${operationName}:${id}:end`;
    mark(startMarkName);

    return (): number | null => {
      mark(endMarkName);
      return measure(`${operationName}:${id}`, startMarkName, endMarkName);
    };
  }, [mark, measure, operationName]);
}
