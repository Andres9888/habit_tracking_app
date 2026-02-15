/**
 * Dashboard Reducer
 * State management for the performance dashboard.
 */

import type {
  DashboardAction,
  DashboardConfig,
  DashboardState,
  FPSData,
  MemoryData,
  NetworkData,
  RenderData,
} from './types';
import { DEFAULT_THRESHOLDS } from '../../lib/performance';

export const initialFPSData: FPSData = {
  averageFPS: 60,
  currentFPS: 60,
  history: [],
  jankFrames: 0,
  status: 'good',
  totalFrames: 0,
};

export const initialMemoryData: MemoryData = {
  currentUsage: null,
  formattedUsage: 'N/A',
  growthRate: null,
  history: [],
  isSupported: false,
  peakUsage: null,
  status: 'good',
};

export const initialNetworkData: NetworkData = {
  averageLatency: 0,
  errorRate: 0,
  p95Latency: 0,
  pendingCount: 0,
  recentRequests: [],
  status: 'good',
  totalRequests: 0,
};

export const initialRenderData: RenderData = {
  recentRenders: [],
  slowComponents: [],
  status: 'good',
  totalRenders: 0,
};

export function createInitialState(config: DashboardConfig): DashboardState {
  return {
    activeTab: 'overview',
    fps: initialFPSData,
    isExpanded: config.defaultExpanded ?? false,
    isVisible: false,
    memory: initialMemoryData,
    network: initialNetworkData,
    renders: initialRenderData,
    thresholds: DEFAULT_THRESHOLDS,
  };
}

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY': {
      return { ...state, isVisible: !state.isVisible };
    }
    case 'TOGGLE_EXPANDED': {
      return { ...state, isExpanded: !state.isExpanded };
    }
    case 'SET_TAB': {
      return { ...state, activeTab: action.tab };
    }
    case 'UPDATE_FPS': {
      return { ...state, fps: action.data };
    }
    case 'UPDATE_MEMORY': {
      return { ...state, memory: action.data };
    }
    case 'UPDATE_NETWORK': {
      return { ...state, network: action.data };
    }
    case 'UPDATE_RENDERS': {
      return { ...state, renders: action.data };
    }
    case 'UPDATE_THRESHOLDS': {
      return {
        ...state,
        thresholds: { ...state.thresholds, ...action.thresholds },
      };
    }
    default: {
      return state;
    }
  }
}
