/**
 * NetworkStatusContext Tests
 * Edge Case Handling: Network connectivity monitoring for offline queue
 *
 * Tests:
 * - Provider initialization
 * - Network status changes
 * - Online/offline detection
 * - Callback registration and invocation
 * - isOnline calculation logic
 * - Context value memoization stability
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';

import {
  NetworkStatusProvider,
  useNetworkStatus,
  useIsOnline,
  useOnlineCallback,
  type NetworkStatus,
} from '../NetworkStatusContext';

// --- expo-network mock ---

type NetworkState = {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean | null;
};

type Listener = (state: NetworkState) => void;

let mockGetNetworkState: jest.Mock;
let mockListeners: Listener[];
let mockRemoveFns: jest.Mock[];

const NetworkStateType = {
  UNKNOWN: 'UNKNOWN',
  NONE: 'NONE',
  CELLULAR: 'CELLULAR',
  WIFI: 'WIFI',
  BLUETOOTH: 'BLUETOOTH',
  ETHERNET: 'ETHERNET',
  WIMAX: 'WIMAX',
  VPN: 'VPN',
  OTHER: 'OTHER',
} as const;

jest.mock('expo-network', () => {
  const actual = {
    NetworkStateType: {
      UNKNOWN: 'UNKNOWN',
      NONE: 'NONE',
      CELLULAR: 'CELLULAR',
      WIFI: 'WIFI',
      BLUETOOTH: 'BLUETOOTH',
      ETHERNET: 'ETHERNET',
      WIMAX: 'WIMAX',
      VPN: 'VPN',
      OTHER: 'OTHER',
    },
    getNetworkStateAsync: (...args: unknown[]) => mockGetNetworkState(...args),
    addNetworkStateListener: (callback: Listener) => {
      mockListeners.push(callback);
      const removeFn = jest.fn(() => {
        mockListeners = mockListeners.filter((l) => l !== callback);
      });
      mockRemoveFns.push(removeFn);
      return { remove: removeFn };
    },
  };
  return actual;
});

// --- Helper factories ---

const createNetworkState = (
  isConnected: boolean,
  isInternetReachable: boolean | null = null,
  type: string = NetworkStateType.WIFI
): NetworkState => ({ type, isConnected, isInternetReachable });

const createWrapper =
  (onStatusChange?: (status: NetworkStatus) => void) =>
  ({ children }: { children: React.ReactNode }) => (
    <NetworkStatusProvider onStatusChange={onStatusChange}>
      {children}
    </NetworkStatusProvider>
  );

const simulateNetworkChange = (state: NetworkState) => {
  mockListeners.forEach((listener) => listener(state));
};

// --- Tests ---

describe('NetworkStatusContext', () => {
  beforeEach(() => {
    mockListeners = [];
    mockRemoveFns = [];
    mockGetNetworkState = jest.fn(() =>
      Promise.resolve(
        createNetworkState(true, true, NetworkStateType.WIFI)
      )
    );
  });

  describe('NetworkStatusProvider', () => {
    it('provides default network status', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      expect(result.current.status.isConnected).toBe(true);
      expect(result.current.isOnline).toBe(true);
    });

    it('fetches initial network state on mount', async () => {
      renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockGetNetworkState).toHaveBeenCalled();
      });
    });

    it('subscribes to network state changes', async () => {
      renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockListeners.length).toBeGreaterThan(0);
      });
    });

    it('unsubscribes on unmount', async () => {
      const { unmount } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockListeners.length).toBeGreaterThan(0);
      });

      unmount();

      expect(mockRemoveFns[0]).toHaveBeenCalled();
    });

    it('returns a stable context value reference when state has not changed', async () => {
      const { result, rerender } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      const firstRef = result.current;

      rerender({});

      expect(result.current).toBe(firstRef);
    });

    it('calls onStatusChange when status changes', async () => {
      const onStatusChange = jest.fn();

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(onStatusChange),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      expect(onStatusChange).toHaveBeenCalled();
    });
  });

  describe('useNetworkStatus', () => {
    it('returns default context when used outside provider', () => {
      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current.isOnline).toBe(true);
      expect(result.current.isChecking).toBe(true);
      expect(typeof result.current.refresh).toBe('function');
    });

    it('returns current network status', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.isConnected).toBe(true);
        expect(result.current.status.connectionType).toBe(
          NetworkStateType.WIFI
        );
      });
    });

    it('updates on network state change', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      act(() => {
        simulateNetworkChange(
          createNetworkState(false, false, NetworkStateType.NONE)
        );
      });

      await waitFor(() => {
        expect(result.current.status.isConnected).toBe(false);
        expect(result.current.isOnline).toBe(false);
      });
    });

    it('provides refresh function', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      mockGetNetworkState.mockClear();

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockGetNetworkState).toHaveBeenCalled();
    });
  });

  describe('useIsOnline', () => {
    it('returns true when connected and internet reachable', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, true)
      );

      const { result } = renderHook(() => useIsOnline(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('returns false when disconnected', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { result } = renderHook(() => useIsOnline(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('returns true when connected but internet reachability unknown', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, null)
      );

      const { result } = renderHook(() => useIsOnline(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('returns false when connected but internet not reachable', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, false)
      );

      const { result } = renderHook(() => useIsOnline(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });
  });

  describe('useOnlineCallback', () => {
    it('registers callback that fires when coming online', async () => {
      const callback = jest.fn();

      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { result } = renderHook(
        () => {
          useOnlineCallback(callback);
          return useNetworkStatus();
        },
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });

    it('does not fire callback when already online', async () => {
      const callback = jest.fn();

      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, true)
      );

      renderHook(
        () => {
          useOnlineCallback(callback);
          return useNetworkStatus();
        },
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockGetNetworkState).toHaveBeenCalled();
      });

      // Small delay to ensure no callback
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).not.toHaveBeenCalled();
    });

    it('unregisters callback on unmount', async () => {
      const callback = jest.fn();

      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { unmount, result } = renderHook(
        () => {
          useOnlineCallback(callback);
          return useNetworkStatus();
        },
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      unmount();

      act(() => {
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('onOnline/onOffline callbacks', () => {
    it('fires onOnline when transitioning from offline to online', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      const onlineCallback = jest.fn();
      let unsubscribe: () => void;

      act(() => {
        unsubscribe = result.current.onOnline(onlineCallback);
      });

      act(() => {
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
      });

      await waitFor(() => {
        expect(onlineCallback).toHaveBeenCalled();
      });

      act(() => {
        unsubscribe();
      });
    });

    it('fires onOffline when transitioning from online to offline', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.WIFI)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      const offlineCallback = jest.fn();
      let unsubscribe: () => void;

      act(() => {
        unsubscribe = result.current.onOffline(offlineCallback);
      });

      act(() => {
        simulateNetworkChange(
          createNetworkState(false, false, NetworkStateType.NONE)
        );
      });

      await waitFor(() => {
        expect(offlineCallback).toHaveBeenCalled();
      });

      act(() => {
        unsubscribe();
      });
    });

    it('unsubscribes callback correctly', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      const callback = jest.fn();
      let unsubscribe: () => void;

      act(() => {
        unsubscribe = result.current.onOnline(callback);
      });

      act(() => {
        unsubscribe();
      });

      // Start offline first
      act(() => {
        simulateNetworkChange(
          createNetworkState(false, false, NetworkStateType.NONE)
        );
      });

      // Then go online - callback should not fire
      act(() => {
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Connection Types', () => {
    it('detects wifi connection', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.WIFI)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(
          NetworkStateType.WIFI
        );
        expect(result.current.status.isExpensive).toBe(false);
      });
    });

    it('detects cellular connection as expensive', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.CELLULAR)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(
          NetworkStateType.CELLULAR
        );
        expect(result.current.status.isExpensive).toBe(true);
      });
    });

    it('handles no connection', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(
          NetworkStateType.NONE
        );
        expect(result.current.isOnline).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid network state changes', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      act(() => {
        simulateNetworkChange(
          createNetworkState(false, false, NetworkStateType.NONE)
        );
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
        simulateNetworkChange(
          createNetworkState(false, false, NetworkStateType.NONE)
        );
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.CELLULAR)
        );
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(
          NetworkStateType.CELLULAR
        );
        expect(result.current.isOnline).toBe(true);
      });
    });

    it('handles error in callback gracefully', async () => {
      mockGetNetworkState.mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.NONE)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });
      const successCallback = jest.fn();

      act(() => {
        result.current.onOnline(errorCallback);
        result.current.onOnline(successCallback);
      });

      act(() => {
        simulateNetworkChange(
          createNetworkState(true, true, NetworkStateType.WIFI)
        );
      });

      await waitFor(() => {
        expect(errorCallback).toHaveBeenCalled();
        expect(successCallback).toHaveBeenCalled();
      });
    });
  });
});
