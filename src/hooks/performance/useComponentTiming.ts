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

/** Hook to measure component lifecycle timing. */
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

/** Hook to measure time between two points in a component. */
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
