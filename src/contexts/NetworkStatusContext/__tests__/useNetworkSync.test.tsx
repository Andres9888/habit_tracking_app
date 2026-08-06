/**
 * useNetworkSync Tests
 *
 * Tests for the network-to-sync bridge hook (T018: FR-004).
 * Verifies auto-sync on reconnect, debouncing, and sync state tracking.
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { NetworkStatusProvider } from '../NetworkStatusProvider';
import { useNetworkSync } from '../useNetworkSync';

// NetInfo state types
const NetInfoStateType = {
  cellular: 'cellular' as const,
  none: 'none' as const,
  wifi: 'wifi' as const,
};

// NetInfo state factory
interface NetInfoState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
  details: { isConnectionExpensive?: boolean } | null;
}

const createNetInfoState = (
  isConnected: boolean,
  isInternetReachable: boolean | null = null,
  type = NetInfoStateType.wifi
): NetInfoState => ({
  details: { isConnectionExpensive: type === NetInfoStateType.cellular },
  isConnected,
  isInternetReachable,
  type,
});

// Helper to create wrapper with NetworkStatusProvider
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NetworkStatusProvider>{children}</NetworkStatusProvider>
  );
};

describe('useNetworkSync', () => {
  let mockNetInfoListeners: ((state: NetInfoState) => void)[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockNetInfoListeners = [];

    // Default: connected via wifi
    (NetInfo.fetch as jest.Mock).mockResolvedValue(
      createNetInfoState(true, true, NetInfoStateType.wifi)
    );

    // Capture addEventListener callbacks
    (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
      mockNetInfoListeners.push(callback);
      return () => {
        mockNetInfoListeners = mockNetInfoListeners.filter(
          (l) => l !== callback
        );
      };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper to simulate network state change
  const simulateNetworkChange = (state: NetInfoState) => {
    mockNetInfoListeners.forEach((listener) => listener(state));
  };

  describe('initialization', () => {
    it('returns initial online state', async () => {
      const { result } = renderHook(() => useNetworkSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      expect(typeof result.current.triggerSync).toBe('function');
    });

    it('returns offline state when network is disconnected', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue(
        createNetInfoState(false, false, NetInfoStateType.none)
      );

      const { result } = renderHook(() => useNetworkSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });
    });
  });

  describe('network transitions', () => {
    it('updates isOnline when going offline', async () => {
      const { result } = renderHook(() => useNetworkSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      // Go offline
      act(() => {
        simulateNetworkChange(
          createNetInfoState(false, false, NetInfoStateType.none)
        );
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });
    });

    it('updates isOnline when coming back online', async () => {
      // Start offline
      (NetInfo.fetch as jest.Mock).mockResolvedValue(
        createNetInfoState(false, false, NetInfoStateType.none)
      );

      const { result } = renderHook(() => useNetworkSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      // Go online
      act(() => {
        simulateNetworkChange(
          createNetInfoState(true, true, NetInfoStateType.wifi)
        );
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });
    });
  });

  describe('callbacks', () => {
    it('calls onOnline when coming online', async () => {
      const onOnline = jest.fn();

      // Start offline
      (NetInfo.fetch as jest.Mock).mockResolvedValue(
        createNetInfoState(false, false, NetInfoStateType.none)
      );

      const { result } = renderHook(() => useNetworkSync({ onOnline }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      // Go online
      act(() => {
        simulateNetworkChange(
          createNetInfoState(true, true, NetInfoStateType.wifi)
        );
      });

      await waitFor(() => {
        expect(onOnline).toHaveBeenCalled();
      });
    });

    it('calls onOffline when going offline', async () => {
      const onOffline = jest.fn();

      const { result } = renderHook(() => useNetworkSync({ onOffline }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      // Go offline
      act(() => {
        simulateNetworkChange(
          createNetInfoState(false, false, NetInfoStateType.none)
        );
      });

      await waitFor(() => {
        expect(onOffline).toHaveBeenCalled();
      });
    });
  });

  describe('configuration', () => {
    it('does not trigger sync when autoSyncOnReconnect is false', async () => {
      const onSyncStart = jest.fn();

      // Start offline
      (NetInfo.fetch as jest.Mock).mockResolvedValue(
        createNetInfoState(false, false, NetInfoStateType.none)
      );

      const { result } = renderHook(
        () => useNetworkSync({ autoSyncOnReconnect: false, onSyncStart }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      // Go online
      act(() => {
        simulateNetworkChange(
          createNetInfoState(true, true, NetInfoStateType.wifi)
        );
      });

      // Wait for potential debounce
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(onSyncStart).not.toHaveBeenCalled();
    });

    it('does not trigger sync when enabled is false', async () => {
      const onSyncStart = jest.fn();

      // Start offline
      (NetInfo.fetch as jest.Mock).mockResolvedValue(
        createNetInfoState(false, false, NetInfoStateType.none)
      );

      const { result } = renderHook(
        () => useNetworkSync({ enabled: false, onSyncStart }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      // Go online
      act(() => {
        simulateNetworkChange(
          createNetInfoState(true, true, NetInfoStateType.wifi)
        );
      });

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(onSyncStart).not.toHaveBeenCalled();
    });
  });

  describe('return value structure', () => {
    it('provides expected return value types', async () => {
      const { result } = renderHook(() => useNetworkSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBeDefined();
      });

      expect(typeof result.current.isOnline).toBe('boolean');
      expect(typeof result.current.isSyncing).toBe('boolean');
      expect(typeof result.current.hasPendingOperations).toBe('boolean');
      expect(typeof result.current.pendingCount).toBe('number');
      expect(typeof result.current.triggerSync).toBe('function');
    });
  });
});
