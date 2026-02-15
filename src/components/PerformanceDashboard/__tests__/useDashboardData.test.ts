/**
 * Dashboard Data Hook Tests
 * Tests for the performance data aggregation hook.
 */

import { renderHook, act } from '@testing-library/react-native';

import { useDashboardData } from '../useDashboardData';

// Mock the usePerformance hook
jest.mock('../../../hooks/performance', () => ({
  usePerformance: () => ({
    getCurrentFPS: jest.fn().mockReturnValue(60),
    getMemoryUsage: jest.fn().mockReturnValue(50 * 1024 * 1024), // 50MB
    getNetworkStats: jest.fn().mockReturnValue({
      averageLatency: 100,
      errorRate: 0.01,
      p95Latency: 150,
    }),
    getReport: jest.fn().mockReturnValue({
      frameData: [],
      marks: [],
      measures: [],
      memorySnapshots: [],
      networkTimings: [],
      renderTimings: [],
      sessionDuration: 1000,
      sessionId: 'test',
      timestamp: Date.now(),
    }),
    getSlowComponents: jest.fn().mockReturnValue([]),
    onFrameData: jest.fn().mockReturnValue(() => {}),
  }),
}));

describe('useDashboardData', () => {
  beforeAll(() => {
    // @ts-ignore
    global.__DEV__ = true;
  });

  describe('Initial state', () => {
    it('starts with visibility false', () => {
      const { result } = renderHook(() => useDashboardData());
      expect(result.current.isVisible).toBe(false);
    });

    it('starts with default tab as overview', () => {
      const { result } = renderHook(() => useDashboardData());
      expect(result.current.activeTab).toBe('overview');
    });

    it('starts collapsed by default', () => {
      const { result } = renderHook(() => useDashboardData());
      expect(result.current.isExpanded).toBe(false);
    });

    it('respects defaultExpanded config', () => {
      const { result } = renderHook(() =>
        useDashboardData({ defaultExpanded: true })
      );
      expect(result.current.isExpanded).toBe(true);
    });
  });

  describe('Visibility toggling', () => {
    it('toggles visibility', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.isVisible).toBe(false);

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('Expanded toggling', () => {
    it('toggles expanded state', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.isExpanded).toBe(false);

      act(() => {
        result.current.toggleExpanded();
      });

      expect(result.current.isExpanded).toBe(true);
    });
  });

  describe('Tab switching', () => {
    it('changes active tab', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.activeTab).toBe('overview');

      act(() => {
        result.current.setTab('fps');
      });

      expect(result.current.activeTab).toBe('fps');

      act(() => {
        result.current.setTab('memory');
      });

      expect(result.current.activeTab).toBe('memory');
    });

    it('supports all tab types', () => {
      const { result } = renderHook(() => useDashboardData());

      const tabs: Array<'overview' | 'fps' | 'memory' | 'network' | 'renders'> =
        ['overview', 'fps', 'memory', 'network', 'renders'];

      for (const tab of tabs) {
        act(() => {
          result.current.setTab(tab);
        });
        expect(result.current.activeTab).toBe(tab);
      }
    });
  });

  describe('FPS data', () => {
    it('has default FPS values', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.fps.currentFPS).toBe(60);
      expect(result.current.fps.averageFPS).toBe(60);
      expect(result.current.fps.status).toBe('good');
    });
  });

  describe('Memory data', () => {
    it('has initial memory state', () => {
      const { result } = renderHook(() => useDashboardData());

      // Initial state before polling starts
      expect(result.current.memory.status).toBe('good');
    });
  });

  describe('Network data', () => {
    it('has initial network state', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.network.status).toBe('good');
    });
  });

  describe('Render data', () => {
    it('has initial render state', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.renders.status).toBe('good');
      expect(result.current.renders.slowComponents).toEqual([]);
    });
  });

  describe('Thresholds', () => {
    it('has default performance thresholds', () => {
      const { result } = renderHook(() => useDashboardData());

      expect(result.current.thresholds.targetFPS).toBe(60);
      expect(result.current.thresholds.maxMemoryUsage).toBe(200 * 1024 * 1024);
      expect(result.current.thresholds.maxNetworkLatency).toBe(200);
    });
  });
});
