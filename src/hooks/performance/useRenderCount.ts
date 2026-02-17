/**
 * useRenderCount Hook
 * Track and log component render counts for debugging.
 */

import { useRef, useEffect } from 'react';
import { usePerformance } from './usePerformance';
import { now } from '../../lib/performance';

interface RenderCountOptions {
  log?: boolean;
  warnThreshold?: number;
}

/**
 * Hook to track component render count and timing.
 * Useful for identifying components that re-render excessively.
 *
 * @description
 * Monitors every render of a component, tracking:
 * - Total render count since mount
 * - Time between renders
 * - Warns when render count exceeds threshold (development only)
 *
 * @param componentName - Unique identifier for the component
 * @param options - Configuration options
 * @param options.log - Whether to log each render to console (default: false)
 * @param options.warnThreshold - Render count that triggers warning (default: 50)
 * @returns Current render count
 *
 * @example
 * ```tsx
 * function ExpensiveComponent({ data }) {
 *   const renderCount = useRenderCount('ExpensiveComponent', {
 *     log: __DEV__,
 *     warnThreshold: 20
 *   });
 *
 *   // If this logs >20, investigate why component re-renders
 *   return <View>{data.map(...)}</View>;
 * }
 * ```
 */
export function useRenderCount(
  componentName: string,
  options: RenderCountOptions = {}
): number {
  const { log = false, warnThreshold = 50 } = options;
  const renderCount = useRef(0);
  const lastRenderTime = useRef(now());
  const { trackRender } = usePerformance();

  useEffect(() => {
    const currentTime = now();
    const renderDuration = currentTime - lastRenderTime.current;
    lastRenderTime.current = currentTime;

    renderCount.current += 1;
    trackRender(componentName, renderDuration);

    if (log) {
      const count = renderCount.current;
      const message = `[Render] ${componentName}: #${count} (${renderDuration.toFixed(2)}ms)`;
      if (count >= warnThreshold && __DEV__) console.warn(message);
    }
  });

  return renderCount.current;
}
