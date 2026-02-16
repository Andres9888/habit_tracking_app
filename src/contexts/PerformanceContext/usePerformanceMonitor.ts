/**
 * Performance Monitor Hook - Core monitoring logic for PerformanceProvider.
 */
import { useCallback, useState } from 'react';
import { FrameMonitor, now } from '../../lib/performance';
import type {
  FrameTimingData,
  PerformanceBaseline,
} from '../../lib/performance';
import type { PerformanceConfig } from './types';
import { generateSessionId, useMonitorRefs } from './useMonitorRefs';

/**
 * Core performance monitoring hook that manages frame timing, memory usage,
 * and network latency tracking.
 * 
 * Provides methods to start/stop monitoring, save performance baselines,
 * and clear collected data.
 * 
 * @param config - Performance monitoring configuration (frame monitoring, memory interval, etc.)
 * @returns Performance monitoring state and control methods
 */
export function usePerformanceMonitor(config: PerformanceConfig) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [baseline, setBaseline] = useState<PerformanceBaseline | null>(null);
  const refs = useMonitorRefs();

  const handleFrameSample = useCallback(
    (data: FrameTimingData) => {
      for (const cb of refs.frameCallbacksRef.current) cb(data);
    },
    [refs.frameCallbacksRef]
  );

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    setIsMonitoring(true);
    refs.timerRef.current.mark('monitoring:start');
    if (config.frameMonitoring) {
      refs.frameMonitorRef.current = new FrameMonitor(handleFrameSample);
      refs.frameMonitorRef.current.start();
    }
    if (config.memoryMonitoring) {
      refs.memoryMonitorRef.current.start(config.memoryInterval);
    }
  }, [
    config.frameMonitoring,
    config.memoryInterval,
    config.memoryMonitoring,
    handleFrameSample,
    isMonitoring,
    refs,
  ]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;
    setIsMonitoring(false);
    refs.timerRef.current.mark('monitoring:stop');
    refs.frameMonitorRef.current?.stop();
    refs.memoryMonitorRef.current.stop();
  }, [isMonitoring, refs]);

  const saveBaseline = useCallback((): PerformanceBaseline => {
    const newBaseline: PerformanceBaseline = {
      averageFPS: refs.frameMonitorRef.current?.getCurrentFPS() ?? 60,
      averageFrameTime: 16.67,
      memoryUsage: refs.memoryMonitorRef.current.getCurrentUsage() ?? 0,
      networkLatency: refs.networkMonitorRef.current.getAverageLatency(),
      timestamp: now(),
    };
    setBaseline(newBaseline);
    return newBaseline;
  }, [refs]);

  const clearData = useCallback(() => {
    refs.timerRef.current.clear();
    refs.frameMonitorRef.current?.clear();
    refs.memoryMonitorRef.current.clear();
    refs.renderTrackerRef.current.clear();
    refs.networkMonitorRef.current.clear();
    refs.sessionIdRef.current = generateSessionId();
  }, [refs]);

  return {
    baseline,
    clearData,
    config,
    isMonitoring,
    saveBaseline,
    startMonitoring,
    stopMonitoring,
    ...refs,
  };
}
