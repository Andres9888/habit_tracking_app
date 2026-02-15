/**
 * Context Callbacks Factory
 * Creates callback functions for the performance context.
 */

import type { FrameTimingData } from '../../lib/performance';
import type { usePerformanceMonitor } from './usePerformanceMonitor';
import { DEFAULT_THRESHOLDS, now } from '../../lib/performance';

export function createContextCallbacks(
  monitor: ReturnType<typeof usePerformanceMonitor>
) {
  const mark = (name: string, metadata?: Record<string, unknown>) => {
    monitor.timerRef.current.mark(name, metadata);
  };
  const measure = (
    name: string,
    startMark: string,
    endMark?: string
  ): number | null =>
    monitor.timerRef.current.measure(name, startMark, endMark)?.duration ??
    null;
  const trackRender = (componentName: string, duration: number) => {
    if (monitor.config.renderTracking) {
      monitor.renderTrackerRef.current.recordRender(componentName, duration);
    }
  };
  const getCurrentFPS = () =>
    monitor.frameMonitorRef.current?.getCurrentFPS() ?? 0;
  const getMemoryUsage = () =>
    monitor.memoryMonitorRef.current.getCurrentUsage();
  const getNetworkStats = () => monitor.networkMonitorRef.current.getStats();
  const getSlowComponents = (thresholdMs?: number) =>
    monitor.renderTrackerRef.current.getSlowComponents(
      thresholdMs ?? DEFAULT_THRESHOLDS.maxRenderTime
    );
  const getBaseline = () => monitor.baseline;

  const getReport = () => {
    const timerData = monitor.timerRef.current.export();
    return {
      baseline: monitor.baseline ?? undefined,
      frameData: monitor.frameMonitorRef.current?.getSamples() ?? [],
      marks: timerData.marks,
      measures: timerData.measures,
      memorySnapshots: monitor.memoryMonitorRef.current.getSnapshots(),
      networkTimings: monitor.networkMonitorRef.current.getAllTimings(),
      renderTimings: monitor.renderTrackerRef.current.getAllTimings(),
      sessionDuration: monitor.timerRef.current.getSessionDuration(),
      sessionId: monitor.sessionIdRef.current,
      timestamp: now(),
    };
  };

  const onFrameData = (callback: (data: FrameTimingData) => void) => {
    monitor.frameCallbacksRef.current.add(callback);
    return () => {
      monitor.frameCallbacksRef.current.delete(callback);
    };
  };

  return {
    clearData: monitor.clearData,
    getBaseline,
    getCurrentFPS,
    getMemoryUsage,
    getNetworkStats,
    getReport,
    getSlowComponents,
    isMonitoring: monitor.isMonitoring,
    mark,
    measure,
    onFrameData,
    saveBaseline: monitor.saveBaseline,
    startMonitoring: monitor.startMonitoring,
    stopMonitoring: monitor.stopMonitoring,
    trackRender,
  };
}
