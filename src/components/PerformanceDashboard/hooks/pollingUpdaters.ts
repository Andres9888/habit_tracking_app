/**
 * Polling Updater Functions
 * Pure functions for updating dashboard metrics via dispatch.
 */

import type { RenderTiming } from '../../../lib/performance';
import type { DashboardAction, MemoryData } from '../types';
import { formatBytes, getStatusLevel } from '../statusUtils';

export function updateMemory(
  getMemoryUsage: () => number | null,
  historyRef: React.MutableRefObject<MemoryData['history']>,
  historyLimit: number,
  memoryBudget: number,
  dispatch: React.Dispatch<DashboardAction>
) {
  const memUsage = getMemoryUsage();
  if (memUsage === null) return;

  const newSnapshot = {
    estimated: true,
    jsHeapUsed: memUsage,
    timestamp: Date.now(),
  };
  historyRef.current = [
    ...historyRef.current.slice(-(historyLimit - 1)),
    newSnapshot,
  ];

  const history = historyRef.current;
  const peak = Math.max(...history.map((h) => h.jsHeapUsed ?? 0));
  const growthRate =
    history.length >= 2
      ? (history.at(-1).jsHeapUsed ?? 0) - (history[0].jsHeapUsed ?? 0)
      : null;

  dispatch({
    data: {
      currentUsage: memUsage,
      formattedUsage: formatBytes(memUsage),
      growthRate,
      history,
      isSupported: true,
      peakUsage: peak,
      status: getStatusLevel(memUsage, memoryBudget),
    },
    type: 'UPDATE_MEMORY',
  });
}

export function updateNetwork(
  getNetworkStats: () => {
    averageLatency: number;
    errorRate: number;
    p95Latency: number;
  },
  getReport: () => { networkTimings: unknown[] },
  maxLatency: number,
  dispatch: React.Dispatch<DashboardAction>
) {
  const netStats = getNetworkStats();
  const report = getReport();

  dispatch({
    data: {
      ...netStats,
      pendingCount: 0,
      recentRequests: report.networkTimings.slice(-10),
      status: getStatusLevel(netStats.p95Latency, maxLatency),
      totalRequests: report.networkTimings.length,
    },
    type: 'UPDATE_NETWORK',
  });
}

export function updateRenders(
  getReport: () => { renderTimings: RenderTiming[] },
  getSlowComponents: (threshold?: number) => RenderTiming[],
  maxRenderTime: number,
  dispatch: React.Dispatch<DashboardAction>
) {
  const report = getReport();
  const slowComponents = getSlowComponents(maxRenderTime);

  dispatch({
    data: {
      recentRenders: report.renderTimings.slice(-20),
      slowComponents,
      status: slowComponents.length > 0 ? 'warning' : 'good',
      totalRenders: report.renderTimings.reduce((s, r) => s + r.renderCount, 0),
    },
    type: 'UPDATE_RENDERS',
  });
}
