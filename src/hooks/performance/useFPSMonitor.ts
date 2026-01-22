/**
 * useFPSMonitor Hook - Monitor and report FPS during component lifetime.
 */
import { useCallback, useEffect, useState } from 'react';
import { usePerformance } from './usePerformance';
import type { FrameTimingData } from '../../lib/performance';

interface FPSStats {
  averageFPS: number;
  currentFPS: number;
  isJanking: boolean;
  jankPercentage: number;
}
interface FPSMonitorOptions {
  dropThreshold?: number;
  onFPSDrop?: (fps: number) => void;
  updateState?: boolean;
}

const DEFAULT_DROP_THRESHOLD = 45;

/**
 * Hook to monitor FPS during component lifetime.
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { currentFPS, isJanking } = useFPSMonitor({ onFPSDrop: (fps) => console.warn(`FPS dropped to ${fps}`) });
 *   return <View><Text>FPS: {currentFPS.toFixed(0)}</Text>{isJanking && <Text>Performance degraded!</Text>}</View>;
 * }
 * ```
 */
export function useFPSMonitor(options: FPSMonitorOptions = {}): FPSStats {
  const {
    dropThreshold = DEFAULT_DROP_THRESHOLD,
    onFPSDrop,
    updateState = true,
  } = options;
  const { getCurrentFPS, onFrameData } = usePerformance();
  const [stats, setStats] = useState<FPSStats>({
    averageFPS: 60,
    currentFPS: 60,
    isJanking: false,
    jankPercentage: 0,
  });

  const handleFrameData = useCallback(
    (data: FrameTimingData) => {
      const isJanking = data.fps < dropThreshold;
      if (isJanking && onFPSDrop) {
        onFPSDrop(data.fps);
      }
      if (updateState) {
        setStats({
          averageFPS: data.fps,
          currentFPS: data.fps,
          isJanking,
          jankPercentage: (data.jankFrames / data.totalFrames) * 100,
        });
      }
    },
    [dropThreshold, onFPSDrop, updateState]
  );

  useEffect(() => {
    const unsubscribe = onFrameData(handleFrameData);
    return unsubscribe;
  }, [onFrameData, handleFrameData]);

  useEffect(() => {
    if (!updateState) return;
    const interval = setInterval(() => {
      const fps = getCurrentFPS();
      if (fps > 0) {
        setStats((prev) => ({
          ...prev,
          currentFPS: fps,
          isJanking: fps < dropThreshold,
        }));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [getCurrentFPS, updateState, dropThreshold]);

  return stats;
}
