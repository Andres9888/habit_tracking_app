/**
 * Performance Context Definition
 * React context for performance monitoring.
 */

import { createContext } from 'react';

import type { PerformanceContextValue } from './types';

const noop = () => {};
const noopReturn =
  <T>(val: T) =>
  () =>
    val;

/** Performance context with default no-op implementations */
export const PerformanceContext = createContext<PerformanceContextValue>({
  clearData: noop,
  getBaseline: noopReturn(null),
  getCurrentFPS: noopReturn(0),
  getMemoryUsage: noopReturn(null),
  getNetworkStats: noopReturn({
    averageLatency: 0,
    errorRate: 0,
    p95Latency: 0,
  }),
  getReport: () => ({
    frameData: [],
    marks: [],
    measures: [],
    memorySnapshots: [],
    networkTimings: [],
    renderTimings: [],
    sessionDuration: 0,
    sessionId: '',
    timestamp: Date.now(),
  }),
  getSlowComponents: noopReturn([]),
  isMonitoring: false,
  mark: noop,
  measure: noopReturn(null),
  onFrameData: () => noop,
  saveBaseline: () => ({
    averageFPS: 0,
    averageFrameTime: 0,
    memoryMetrics: { averageUsage: 0, leakIndicator: false, peakUsage: 0 },
    memoryUsage: 0,
    networkLatency: 0,
    networkMetrics: { averageLatency: 0, errorRate: 0, p95Latency: 0 },
    runtimeMetrics: { averageFPS: 0, jankPercentage: 0, p95FrameTime: 0 },
    startupMetrics: {},
    timestamp: Date.now(),
    version: '1.0.0',
  }),
  startMonitoring: noop,
  stopMonitoring: noop,
  trackRender: noop,
});

PerformanceContext.displayName = 'PerformanceContext';
