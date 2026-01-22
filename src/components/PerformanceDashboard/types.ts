/**
 * Performance Dashboard Types
 * Type definitions for the dev-only performance monitoring dashboard.
 */

import type {
  FrameTimingData,
  MemorySnapshot,
  NetworkTiming,
  RenderTiming,
  PerformanceThresholds,
} from '../../lib/performance';

// Re-export types used by components

/** Dashboard tab identifiers */
export type DashboardTab =
  | 'overview'
  | 'fps'
  | 'memory'
  | 'network'
  | 'renders';

/** Status indicator levels */
export type StatusLevel = 'good' | 'warning' | 'critical';

/** Metric card configuration */
export interface MetricCard {
  currentValue: number | string;
  label: string;
  status: StatusLevel;
  threshold?: number;
  unit?: string;
}

/** FPS dashboard data */
export interface FPSData {
  averageFPS: number;
  currentFPS: number;
  history: FrameTimingData[];
  jankFrames: number;
  status: StatusLevel;
  totalFrames: number;
}

/** Memory dashboard data */
export interface MemoryData {
  currentUsage: number | null;
  formattedUsage: string;
  growthRate: number | null;
  history: MemorySnapshot[];
  isSupported: boolean;
  peakUsage: number | null;
  status: StatusLevel;
}

/** Network dashboard data */
export interface NetworkData {
  averageLatency: number;
  errorRate: number;
  p95Latency: number;
  pendingCount: number;
  recentRequests: NetworkTiming[];
  status: StatusLevel;
  totalRequests: number;
}

/** Render performance data */
export interface RenderData {
  recentRenders: RenderTiming[];
  slowComponents: RenderTiming[];
  status: StatusLevel;
  totalRenders: number;
}

/** Complete dashboard state */
export interface DashboardState {
  activeTab: DashboardTab;
  fps: FPSData;
  isExpanded: boolean;
  isVisible: boolean;
  memory: MemoryData;
  network: NetworkData;
  renders: RenderData;
  thresholds: PerformanceThresholds;
}

/** Dashboard actions for reducer */
export type DashboardAction =
  | { type: 'TOGGLE_VISIBILITY' }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_TAB'; tab: DashboardTab }
  | { type: 'UPDATE_FPS'; data: FPSData }
  | { type: 'UPDATE_MEMORY'; data: MemoryData }
  | { type: 'UPDATE_NETWORK'; data: NetworkData }
  | { type: 'UPDATE_RENDERS'; data: RenderData }
  | { type: 'UPDATE_THRESHOLDS'; thresholds: Partial<PerformanceThresholds> };

/** Dashboard configuration */
export interface DashboardConfig {
  defaultExpanded?: boolean;
  enabled?: boolean;
  historyLimit?: number;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  updateInterval?: number;
}

export const DEFAULT_DASHBOARD_CONFIG: Required<DashboardConfig> = {
  defaultExpanded: false,
  enabled: true,
  historyLimit: 60,
  position: 'bottom-right',
  updateInterval: 1000,
};

export { type RenderTiming } from '../../lib/performance';
