/**
 * Dashboard Data Hook
 * Aggregates performance metrics for the dashboard display.
 */

import { useCallback, useReducer, useRef } from 'react';
import { usePerformance } from '../../hooks/performance';
import type {
  DashboardConfig,
  DashboardState,
  FPSData,
  MemoryData,
} from './types';
import { DEFAULT_DASHBOARD_CONFIG } from './types';
import { createInitialState, dashboardReducer } from './dashboardReducer';
import { useFPSSubscription } from './hooks/useFPSSubscription';
import { usePollingUpdates } from './hooks/usePollingUpdates';

export function useDashboardData(config: DashboardConfig = {}) {
  const mergedConfig = { ...DEFAULT_DASHBOARD_CONFIG, ...config };
  const [state, dispatch] = useReducer(
    dashboardReducer,
    mergedConfig,
    createInitialState
  );
  const {
    getMemoryUsage,
    getNetworkStats,
    getReport,
    getSlowComponents,
    onFrameData,
  } = usePerformance();

  const fpsHistoryRef = useRef<FPSData['history']>([]);
  const memoryHistoryRef = useRef<MemoryData['history']>([]);

  useFPSSubscription(
    onFrameData,
    fpsHistoryRef,
    mergedConfig.historyLimit,
    dispatch
  );

  usePollingUpdates({
    dispatch,
    getMemoryUsage,
    getNetworkStats,
    getReport,
    getSlowComponents,
    historyLimit: mergedConfig.historyLimit,
    isVisible: state.isVisible,
    memoryHistoryRef,
    thresholds: state.thresholds,
    updateInterval: mergedConfig.updateInterval,
  });

  const toggleVisibility = useCallback(
    () => dispatch({ type: 'TOGGLE_VISIBILITY' }),
    []
  );
  const toggleExpanded = useCallback(
    () => dispatch({ type: 'TOGGLE_EXPANDED' }),
    []
  );
  const setTab = useCallback(
    (tab: DashboardState['activeTab']) => dispatch({ tab, type: 'SET_TAB' }),
    []
  );

  return { ...state, setTab, toggleExpanded, toggleVisibility };
}
