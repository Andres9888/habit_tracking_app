/**
 * SyncStatusContext Tests
 *
 * Tests:
 * - Provider initialization
 * - Status state management
 * - Sync callback registration
 * - Status indicator derivation
 * - Integration with useSyncOrchestrator
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import {
  SyncStatusProvider,
  useSyncStatus,
  useSyncStatusState,
  useIsSyncing,
  useHasPendingSync,
  useSyncIndicator,
  useOnSyncStart,
  useOnSyncComplete,
  useOnSyncError,
} from '../index';
import type { SyncOrchestratorResult } from '../../../lib/offline/sync/types';

// Mock useSyncOrchestrator
const mockTriggerSync = jest.fn();
const mockSubscribe = jest.fn();
const mockState = {
  isSyncing: false,
  isActive: true,
  lastResult: undefined as SyncOrchestratorResult | undefined,
  lastSuccessfulSyncAt: undefined as number | undefined,
};
let mockHasPendingOperations = false;
let mockFailedOperationCount = 0;
let onSyncCompleteCallback:
  | ((result: SyncOrchestratorResult) => void)
  | undefined;
let onSyncErrorCallback: ((error: Error) => void) | undefined;
const eventListeners: Array<(event: { type: string }) => void> = [];

const mockResetFailedOperations = jest.fn(() => 2);
const mockDiscardFailedOperations = jest.fn(() => 2);
const mockResetCircuitBreaker = jest.fn();

jest.mock('../failedOperations', () => ({
  resetFailedOperations: () => mockResetFailedOperations(),
  discardFailedOperations: () => mockDiscardFailedOperations(),
}));

jest.mock('../../../lib/offline', () => ({
  resetDefaultCircuitBreaker: () => mockResetCircuitBreaker(),
}));

jest.mock('../../../lib/offline/sync/useSyncOrchestrator', () => ({
  useSyncOrchestrator: (options?: {
    autoStart?: boolean;
    onSyncComplete?: (result: SyncOrchestratorResult) => void;
    onSyncError?: (error: Error) => void;
  }) => {
    onSyncCompleteCallback = options?.onSyncComplete;
    onSyncErrorCallback = options?.onSyncError;
    return {
      state: mockState,
      hasPendingOperations: mockHasPendingOperations,
      pendingOperationCount: mockHasPendingOperations ? 1 : 0,
      failedOperationCount: mockFailedOperationCount,
      isOnline: true,
      triggerSync: mockTriggerSync,
      subscribe: (listener: (event: { type: string }) => void) => {
        eventListeners.push(listener);
        return () => {
          const idx = eventListeners.indexOf(listener);
          if (idx > -1) {
            eventListeners.splice(0, eventListeners.length, ...eventListeners.slice(0, idx), ...eventListeners.slice(idx + 1));
          }
        };
      },
      start: jest.fn(),
      stop: jest.fn(),
    };
  },
}));

// Helper to create wrapper with provider
const createWrapper = (
  onStatusChange?: (status: ReturnType<typeof useSyncStatusState>) => void
) => {
  return ({ children }: { children: React.ReactNode }) => (
    <SyncStatusProvider onStatusChange={onStatusChange}>
      {children}
    </SyncStatusProvider>
  );
};

// Helper to simulate sync events
const simulateSyncEvent = (type: string) => {
  eventListeners.forEach((listener) => listener({ type }));
};

describe('SyncStatusContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.isSyncing = false;
    mockState.isActive = true;
    mockState.lastResult = undefined;
    mockState.lastSuccessfulSyncAt = undefined;
    mockHasPendingOperations = false;
    mockFailedOperationCount = 0;
    eventListeners.length = 0;
    onSyncCompleteCallback = undefined;
    onSyncErrorCallback = undefined;
  });

  describe('SyncStatusProvider', () => {
    it('provides default sync status', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status.isSyncing).toBe(false);
      expect(result.current.status.isActive).toBe(true);
      expect(result.current.status.indicator).toBe('idle');
    });

    it('exposes triggerSync function', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.triggerSync).toBe('function');
    });

    it('exposes callback registration functions', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.onSyncStart).toBe('function');
      expect(typeof result.current.onSyncComplete).toBe('function');
      expect(typeof result.current.onSyncError).toBe('function');
    });

    it('calls onStatusChange when status changes', async () => {
      const onStatusChange = jest.fn();
      renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(onStatusChange),
      });

      expect(onStatusChange).toHaveBeenCalled();
    });
  });

  describe('useSyncStatus', () => {
    it('returns full context value', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('triggerSync');
      expect(result.current).toHaveProperty('onSyncStart');
      expect(result.current).toHaveProperty('onSyncComplete');
      expect(result.current).toHaveProperty('onSyncError');
    });

    it('reflects syncing state', () => {
      mockState.isSyncing = true;

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status.isSyncing).toBe(true);
      expect(result.current.status.indicator).toBe('syncing');
    });
  });

  describe('useSyncStatusState', () => {
    it('returns only status object', () => {
      const { result } = renderHook(() => useSyncStatusState(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('isSyncing');
      expect(result.current).toHaveProperty('isActive');
      expect(result.current).toHaveProperty('indicator');
      expect(result.current).not.toHaveProperty('triggerSync');
    });
  });

  describe('useIsSyncing', () => {
    it('returns false when not syncing', () => {
      mockState.isSyncing = false;

      const { result } = renderHook(() => useIsSyncing(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe(false);
    });

    it('returns true when syncing', () => {
      mockState.isSyncing = true;

      const { result } = renderHook(() => useIsSyncing(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useHasPendingSync', () => {
    it('returns false when no pending operations', () => {
      mockHasPendingOperations = false;

      const { result } = renderHook(() => useHasPendingSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe(false);
    });

    it('returns true when has pending operations', () => {
      mockHasPendingOperations = true;

      const { result } = renderHook(() => useHasPendingSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useSyncIndicator', () => {
    it('returns idle when not syncing and no result', () => {
      const { result } = renderHook(() => useSyncIndicator(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe('idle');
    });

    it('returns syncing when sync in progress', () => {
      mockState.isSyncing = true;

      const { result } = renderHook(() => useSyncIndicator(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe('syncing');
    });

    it('returns success after successful sync', () => {
      mockState.lastResult = {
        initiated: true,
        processed: 5,
        succeeded: 5,
        failed: 0,
        skipped: 0,
      };

      const { result } = renderHook(() => useSyncIndicator(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe('success');
    });
  });

  describe('Sync Callbacks', () => {
    it('fires onSyncStart callback when sync starts', async () => {
      const callback = jest.fn();

      const { result } = renderHook(
        () => {
          useOnSyncStart(callback);
          return useSyncStatus();
        },
        { wrapper: createWrapper() }
      );

      act(() => {
        simulateSyncEvent('sync:started');
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
      });
    });

    it('fires onSyncComplete callback when sync completes', async () => {
      const callback = jest.fn();

      renderHook(
        () => {
          useOnSyncComplete(callback);
          return useSyncStatus();
        },
        { wrapper: createWrapper() }
      );

      const mockResult: SyncOrchestratorResult = {
        initiated: true,
        processed: 3,
        succeeded: 3,
        failed: 0,
        skipped: 0,
      };

      act(() => {
        onSyncCompleteCallback?.(mockResult);
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(mockResult);
      });
    });

    it('fires onSyncError callback on error', async () => {
      const callback = jest.fn();

      renderHook(
        () => {
          useOnSyncError(callback);
          return useSyncStatus();
        },
        { wrapper: createWrapper() }
      );

      const error = new Error('Sync failed');

      act(() => {
        onSyncErrorCallback?.(error);
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(error);
      });
    });

    it('unsubscribes callback on unmount', async () => {
      const callback = jest.fn();

      const { unmount } = renderHook(
        () => {
          useOnSyncStart(callback);
          return useSyncStatus();
        },
        { wrapper: createWrapper() }
      );

      unmount();

      act(() => {
        simulateSyncEvent('sync:started');
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('supports multiple callbacks', async () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onSyncStart(callback1);
        result.current.onSyncStart(callback2);
      });

      act(() => {
        simulateSyncEvent('sync:started');
      });

      await waitFor(() => {
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });
    });

    it('returns unsubscribe function from callback registration', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      let unsubscribe: () => void;
      act(() => {
        unsubscribe = result.current.onSyncStart(jest.fn());
      });

      expect(typeof unsubscribe!).toBe('function');
    });

    it('unsubscribe prevents future callback invocations', async () => {
      const callback = jest.fn();

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      let unsubscribe: () => void;
      act(() => {
        unsubscribe = result.current.onSyncStart(callback);
      });

      act(() => {
        unsubscribe();
      });

      act(() => {
        simulateSyncEvent('sync:started');
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('triggerSync', () => {
    it('calls underlying triggerSync', async () => {
      const mockResult: SyncOrchestratorResult = {
        initiated: true,
        processed: 2,
        succeeded: 2,
        failed: 0,
        skipped: 0,
      };
      mockTriggerSync.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.triggerSync();
      });

      expect(mockTriggerSync).toHaveBeenCalled();
    });

    it('returns sync result', async () => {
      const mockResult: SyncOrchestratorResult = {
        initiated: true,
        processed: 5,
        succeeded: 4,
        failed: 1,
        skipped: 0,
      };
      mockTriggerSync.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      let syncResult: SyncOrchestratorResult | undefined;
      await act(async () => {
        syncResult = await result.current.triggerSync();
      });

      expect(syncResult).toEqual(mockResult);
    });
  });

  describe('Status Indicator Derivation', () => {
    it('prioritizes syncing over other states', () => {
      mockState.isSyncing = true;
      mockState.lastResult = {
        initiated: true,
        processed: 5,
        succeeded: 5,
        failed: 0,
        skipped: 0,
      };

      const { result } = renderHook(() => useSyncIndicator(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe('syncing');
    });

    it('shows error after sync error', async () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Network failure');

      act(() => {
        onSyncErrorCallback?.(error);
      });

      await waitFor(() => {
        expect(result.current.status.lastError).toEqual(error);
        expect(result.current.status.indicator).toBe('error');
      });
    });

    it('surfaces failed operations in status', () => {
      mockFailedOperationCount = 3;

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status.failedCount).toBe(3);
      expect(result.current.status.hasFailedOperations).toBe(true);
    });

    it('reports no failed operations when count is zero', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.status.failedCount).toBe(0);
      expect(result.current.status.hasFailedOperations).toBe(false);
    });

    it('clears error after successful sync', async () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      // First, trigger an error
      act(() => {
        onSyncErrorCallback?.(new Error('Failed'));
      });

      // Then complete successfully
      act(() => {
        onSyncCompleteCallback?.({
          initiated: true,
          processed: 1,
          succeeded: 1,
          failed: 0,
          skipped: 0,
        });
      });

      await waitFor(() => {
        expect(result.current.status.lastError).toBeUndefined();
      });
    });
  });

  describe('retryFailed / discardFailed', () => {
    it('resets failed ops, resets the circuit breaker, then syncs', async () => {
      mockTriggerSync.mockResolvedValue({
        initiated: true,
        processed: 2,
        succeeded: 2,
        failed: 0,
        skipped: 0,
      });

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.retryFailed();
      });

      expect(mockResetFailedOperations).toHaveBeenCalled();
      expect(mockResetCircuitBreaker).toHaveBeenCalled();
      expect(mockTriggerSync).toHaveBeenCalled();
    });

    it('does not reset the circuit breaker when nothing was reset', async () => {
      mockResetFailedOperations.mockReturnValueOnce(0);
      mockTriggerSync.mockResolvedValue({
        initiated: false,
        processed: 0,
        succeeded: 0,
        failed: 0,
        skipped: 0,
      });

      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.retryFailed();
      });

      expect(mockResetCircuitBreaker).not.toHaveBeenCalled();
      expect(mockTriggerSync).toHaveBeenCalled();
    });

    it('discardFailed delegates to discardFailedOperations', () => {
      const { result } = renderHook(() => useSyncStatus(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.discardFailed();
      });

      expect(mockDiscardFailedOperations).toHaveBeenCalled();
    });
  });
});
