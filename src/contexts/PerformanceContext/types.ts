/**
 * Performance Context Types
 * Type definitions for the performance monitoring context.
 */

import type { ReactNode } from 'react';
import type {
  FrameTimingData,
  PerformanceBaseline,
  PerformanceReport,
  PerformanceThresholds,
  RenderTiming,
} from '../../lib/performance';

/** Performance context configuration */
export interface PerformanceConfig {
  enabled: boolean;
  frameMonitoring: boolean;
  memoryInterval: number;
  memoryMonitoring: boolean;
  networkTracking: boolean;
  onPerformanceIssue?: (issue: PerformanceIssue) => void;
  renderTracking: boolean;
  thresholds?: Partial<PerformanceThresholds>;
}

/** Performance issue detected by monitoring */
export interface PerformanceIssue {
  data: Record<string, unknown>;
  message: string;
  severity: 'critical' | 'warning';
  timestamp: number;
  type: 'fps_drop' | 'memory_leak' | 'slow_network' | 'slow_render';
}

/** Performance context value exposed to consumers */
export interface PerformanceContextValue {
  clearData: () => void;
  getBaseline: () => PerformanceBaseline | null;
  getCurrentFPS: () => number;
  getMemoryUsage: () => number | null;
  getNetworkStats: () => {
    averageLatency: number;
    errorRate: number;
    p95Latency: number;
  };
  getReport: () => PerformanceReport;
  getSlowComponents: (thresholdMs?: number) => RenderTiming[];
  isMonitoring: boolean;
  mark: (name: string, metadata?: Record<string, unknown>) => void;
  measure: (name: string, startMark: string, endMark?: string) => number | null;
  onFrameData: (callback: (data: FrameTimingData) => void) => () => void;
  saveBaseline: () => PerformanceBaseline;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  trackRender: (componentName: string, duration: number) => void;
}

/** Provider props */
export interface PerformanceProviderProps {
  children: ReactNode;
  config?: Partial<PerformanceConfig>;
}

/** Default configuration */
export const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: typeof __DEV__ === 'undefined' ? false : __DEV__,
  frameMonitoring: false,
  memoryInterval: 10_000,
  memoryMonitoring: true,
  networkTracking: true,
  renderTracking: true,
};
