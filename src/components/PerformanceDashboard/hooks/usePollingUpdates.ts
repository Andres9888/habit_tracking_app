/**
 * Polling Updates Hook
 * Polls memory, network, and render data when dashboard is visible.
 */

import { useEffect } from 'react';

import type {
  NetworkTiming,
  PerformanceThresholds,
  RenderTiming,
} from '../../../lib/performance';
import type { DashboardAction, MemoryData } from '../types';
import { updateMemory, updateNetwork, updateRenders } from './pollingUpdaters';

interface PollingUpdatesOptions {
  dispatch: React.Dispatch<DashboardAction>;
  getMemoryUsage: () => number | null;
  getNetworkStats: () => {
    averageLatency: number;
    errorRate: number;
    p95Latency: number;
  };
  getReport: () => { networkTimings: NetworkTiming[]; renderTimings: RenderTiming[] };
  getSlowComponents: (threshold?: number) => RenderTiming[];
  historyLimit: number;
  isVisible: boolean;
  memoryHistoryRef: React.MutableRefObject<MemoryData['history']>;
  thresholds: PerformanceThresholds;
  updateInterval: number;
}

export function usePollingUpdates({
  dispatch,
  getMemoryUsage,
  getNetworkStats,
  getReport,
  getSlowComponents,
  historyLimit,
  isVisible,
  memoryHistoryRef,
  thresholds,
  updateInterval,
}: PollingUpdatesOptions) {
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      updateMemory(
        getMemoryUsage,
        memoryHistoryRef,
        historyLimit,
        thresholds.maxMemoryUsage,
        dispatch
      );
      updateNetwork(
        getNetworkStats,
        getReport,
        thresholds.maxNetworkLatency,
        dispatch
      );
      updateRenders(
        getReport,
        getSlowComponents,
        thresholds.maxRenderTime,
        dispatch
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [
    isVisible,
    thresholds,
    getMemoryUsage,
    getNetworkStats,
    getReport,
    getSlowComponents,
    historyLimit,
    updateInterval,
    memoryHistoryRef,
    dispatch,
  ]);
}
