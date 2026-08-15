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
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';

import * as Network from 'expo-network';

import {
  NetworkStatusProvider,
  useNetworkStatus,
  useIsOnline,
  useOnlineCallback,
  type NetworkStatus,
} from '../NetworkStatusContext';

const NetworkStateType = {
  unknown: 'UNKNOWN' as const,
  none: 'NONE' as const,
  cellular: 'CELLULAR' as const,
  wifi: 'WIFI' as const,
};

interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
}

// Helper to create wrapper with provider
const createWrapper = (onStatusChange?: (status: NetworkStatus) => void) => {
  return ({ children }: { children: React.ReactNode }) => (
    <NetworkStatusProvider onStatusChange={onStatusChange}>
      {children}
    </NetworkStatusProvider>
  );
};

// Mock NetInfo state factory
const createNetworkState = (
  isConnected: boolean,
  isInternetReachable: boolean | null = null,
  type: string = NetworkStateType.wifi
): NetworkState => ({
  isConnected,
  isInternetReachable,
  type,
});

describe('NetworkStatusContext', () => {
  let mockNetworkListeners: ((state: NetworkState) => void)[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNetworkListeners = [];

    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
      createNetworkState(true, true, NetworkStateType.wifi)
    );

    (Network.addNetworkStateListener as jest.Mock).mockImplementation(
      (callback) => {
        mockNetworkListeners.push(callback);
        return {
          remove: () => {
            mockNetworkListeners = mockNetworkListeners.filter(
              (l) => l !== callback
            );
          },
        };
      }
    );
  });

  const simulateNetworkChange = (state: NetworkState) => {
    mockNetworkListeners.forEach((listener) => listener(state));
  };

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
        expect(Network.getNetworkStateAsync).toHaveBeenCalled();
      });
    });

    it('subscribes to network state changes', async () => {
      renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(Network.addNetworkStateListener).toHaveBeenCalled();
      });
    });

    it('unsubscribes on unmount', async () => {
      const remove = jest.fn();
      (Network.addNetworkStateListener as jest.Mock).mockReturnValue({
        remove,
      });

      const { unmount } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(Network.addNetworkStateListener).toHaveBeenCalled();
      });

      unmount();

      expect(remove).toHaveBeenCalled();
    });

    it('calls onStatusChange when status changes', async () => {
      const onStatusChange = jest.fn();

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(onStatusChange),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      // Initial fetch calls onStatusChange
      expect(onStatusChange).toHaveBeenCalled();
    });
  });

  describe('useNetworkStatus', () => {
    it('returns default context when used outside provider', () => {
      // When used outside provider, the hook returns default context values
      // This allows components to work in test environments without a provider
      const { result } = renderHook(() => useNetworkStatus());

      // Default assumes online (optimistic)
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
        expect(result.current.status.connectionType).toBe(NetworkStateType.wifi);
      });
    });

    it('updates on network state change', async () => {
      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });

      // Simulate going offline
      act(() => {
        simulateNetworkChange(createNetworkState(false, false, NetworkStateType.none));
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

      // Clear previous calls
      (Network.getNetworkStateAsync as jest.Mock).mockClear();

      await act(async () => {
        await result.current.refresh();
      });

      expect(Network.getNetworkStateAsync).toHaveBeenCalled();
    });
  });

  describe('useIsOnline', () => {
    it('returns true when connected and internet reachable', async () => {
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
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
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
      );

      const { result } = renderHook(() => useIsOnline(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('returns true when connected but internet reachability unknown', async () => {
      // Some devices don't report internet reachability
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
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
      // Connected to WiFi but no internet (captive portal, etc.)
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
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

      // Start offline
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
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

      // Go online
      act(() => {
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });

    it('does not fire callback when already online', async () => {
      const callback = jest.fn();

      // Start online
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(true, true)
      );

      renderHook(
        () => {
          useOnlineCallback(callback);
          return useNetworkStatus();
        },
        { wrapper: createWrapper() }
      );

      // Wait for initialization
      await waitFor(() => {
        expect(Network.getNetworkStateAsync).toHaveBeenCalled();
      });

      // Small delay to ensure no callback
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).not.toHaveBeenCalled();
    });

    it('unregisters callback on unmount', async () => {
      const callback = jest.fn();

      // Start offline
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
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

      // Unmount before going online
      unmount();

      // Go online after unmount
      act(() => {
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
      });

      // Callback should not be called
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('onOnline/onOffline callbacks', () => {
    it('fires onOnline when transitioning from offline to online', async () => {
      // Start offline
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
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

      // Go online
      act(() => {
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
      });

      await waitFor(() => {
        expect(onlineCallback).toHaveBeenCalled();
      });

      // Cleanup
      act(() => {
        unsubscribe();
      });
    });

    it('fires onOffline when transitioning from online to offline', async () => {
      // Start online
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.wifi)
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

      // Go offline
      act(() => {
        simulateNetworkChange(createNetworkState(false, false, NetworkStateType.none));
      });

      await waitFor(() => {
        expect(offlineCallback).toHaveBeenCalled();
      });

      // Cleanup
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

      // Unsubscribe
      act(() => {
        unsubscribe();
      });

      // Start offline first
      act(() => {
        simulateNetworkChange(createNetworkState(false, false, NetworkStateType.none));
      });

      // Then go online - callback should not fire
      act(() => {
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Connection Types', () => {
    it('detects wifi connection', async () => {
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.wifi)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(NetworkStateType.wifi);
        expect(result.current.status.isExpensive).toBe(false);
      });
    });

    it('detects cellular connection as expensive', async () => {
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(true, true, NetworkStateType.cellular)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(NetworkStateType.cellular);
        expect(result.current.status.isExpensive).toBe(true);
      });
    });

    it('handles no connection', async () => {
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
      );

      const { result } = renderHook(() => useNetworkStatus(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(NetworkStateType.none);
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

      // Rapid state changes
      act(() => {
        simulateNetworkChange(createNetworkState(false, false, NetworkStateType.none));
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
        simulateNetworkChange(createNetworkState(false, false, NetworkStateType.none));
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.cellular));
      });

      await waitFor(() => {
        expect(result.current.status.connectionType).toBe(NetworkStateType.cellular);
        expect(result.current.isOnline).toBe(true);
      });
    });

    it('handles error in callback gracefully', async () => {
      // Start offline
      (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
        createNetworkState(false, false, NetworkStateType.none)
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

      // Go online - error in first callback should not prevent second
      act(() => {
        simulateNetworkChange(createNetworkState(true, true, NetworkStateType.wifi));
      });

      await waitFor(() => {
        expect(errorCallback).toHaveBeenCalled();
        expect(successCallback).toHaveBeenCalled();
      });
    });
  });
});
