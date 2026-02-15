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
    }
  });

  return renderCount.current;
}
