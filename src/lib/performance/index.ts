/**
 * Performance Measurement Library
 * Centralized exports for the performance monitoring system.
 */

// Types
export type {
  FrameTimingData,
  MemorySnapshot,
  NetworkTiming,
  PerformanceBaseline,
  PerformanceMark,
  PerformanceMeasure,
  PerformanceReport,
  PerformanceThresholds,
  RenderTiming,
} from './types';

export { DEFAULT_THRESHOLDS } from './types';

// Timer utilities
export { now, PerformanceTimer } from './PerformanceTimer';
export { timeAsync, timeSync } from './timingUtils';

// Frame monitoring
export { FrameMonitor, measureFrameTime } from './FrameMonitor';

// Memory monitoring
export { MemoryMonitor } from './MemoryMonitor';

// Render tracking
export { RenderTracker } from './RenderTracker';

// Network monitoring
export { NetworkMonitor } from './NetworkMonitor';
export { createTrackedFetch } from './trackedFetch';

// Centralized Performance Monitor (NEW)
export {
  getPerformanceMonitor,
  initPerformanceMonitoring,
} from './PerformanceMonitor';
export type {
  ScreenRenderMetrics,
  ConvexQueryMetrics,
  FrameDropMetrics,
} from './PerformanceMonitor';

// React Hooks
export {
  useScreenRenderTracking,
  useScreenRenderTrackingManual,
  useConvexQueryTracking,
  useConvexQueryTrackingManual,
  useUserActionTracking,
} from './hooks';
