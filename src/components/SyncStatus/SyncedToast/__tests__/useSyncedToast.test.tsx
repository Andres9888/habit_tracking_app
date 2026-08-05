/**
 * useSyncedToast Hook Tests
 *
 * Tests for the hook that bridges SyncStatusContext with SyncedToast.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';

import { useSyncedToast } from '../useSyncedToast';
import type { SyncOrchestratorResult } from '../../../../lib/offline/sync/types';

// Track the callback registered via useOnSyncComplete
let registeredCallback: ((result: SyncOrchestratorResult) => void) | null =
  null;

// Mock SyncStatusContext hooks
jest.mock('../../../../contexts/SyncStatusContext/hooks', () => ({
  useOnSyncComplete: jest.fn((callback) => {
    registeredCallback = callback;
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.addWhitelistedNativeProps = jest.fn();
  Reanimated.default.addWhitelistedUIProps = jest.fn();
  return Reanimated;
});

describe('useSyncedToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registeredCallback = null;
  });

  describe('initial state', () => {
    it('returns visible as false initially', () => {
      const { result } = renderHook(() => useSyncedToast());
      expect(result.current.visible).toBe(false);
    });

    it('returns syncedCount as 0 initially', () => {
      const { result } = renderHook(() => useSyncedToast());
      expect(result.current.syncedCount).toBe(0);
    });

    it('provides dismiss function', () => {
      const { result } = renderHook(() => useSyncedToast());
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('provides show function', () => {
      const { result } = renderHook(() => useSyncedToast());
      expect(typeof result.current.show).toBe('function');
    });
  });

  describe('sync completion handling', () => {
    it('registers callback with useOnSyncComplete', () => {
      renderHook(() => useSyncedToast());
      expect(registeredCallback).not.toBeNull();
    });

    it('shows toast when sync completes with succeeded operations', () => {
      const { result } = renderHook(() => useSyncedToast());

      const syncResult: SyncOrchestratorResult = {
        failed: 0,
        initiated: true,
        processed: 5,
        skipped: 0,
        succeeded: 5,
      };

      act(() => {
        registeredCallback?.(syncResult);
      });

      expect(result.current.visible).toBe(true);
      expect(result.current.syncedCount).toBe(5);
    });

    it('does not show toast when no operations succeeded', () => {
      const { result } = renderHook(() => useSyncedToast());

      const syncResult: SyncOrchestratorResult = {
        failed: 0,
        initiated: true,
        processed: 0,
        skipped: 0,
        succeeded: 0,
      };

      act(() => {
        registeredCallback?.(syncResult);
      });

      expect(result.current.visible).toBe(false);
    });

    it('does not show toast when all operations failed', () => {
      const { result } = renderHook(() => useSyncedToast());

      const syncResult: SyncOrchestratorResult = {
        failed: 3,
        initiated: true,
        processed: 3,
        skipped: 0,
        succeeded: 0,
      };

      act(() => {
        registeredCallback?.(syncResult);
      });

      expect(result.current.visible).toBe(false);
    });
  });

  describe('enabled option', () => {
    it('respects enabled=false and does not show toast', () => {
      const { result } = renderHook(() => useSyncedToast({ enabled: false }));

      const syncResult: SyncOrchestratorResult = {
        failed: 0,
        initiated: true,
        processed: 5,
        skipped: 0,
        succeeded: 5,
      };

      act(() => {
        registeredCallback?.(syncResult);
      });

      expect(result.current.visible).toBe(false);
    });

    it('shows toast when enabled=true (default)', () => {
      const { result } = renderHook(() => useSyncedToast({ enabled: true }));

      const syncResult: SyncOrchestratorResult = {
        failed: 0,
        initiated: true,
        processed: 5,
        skipped: 0,
        succeeded: 5,
      };

      act(() => {
        registeredCallback?.(syncResult);
      });

      expect(result.current.visible).toBe(true);
    });
  });

  describe('dismiss function', () => {
    it('hides the toast when called', () => {
      const { result } = renderHook(() => useSyncedToast());

      // First show the toast
      act(() => {
        result.current.show(3);
      });
      expect(result.current.visible).toBe(true);

      // Then dismiss it
      act(() => {
        result.current.dismiss();
      });
      expect(result.current.visible).toBe(false);
    });

    it('calls onDismiss callback when provided', () => {
      const onDismiss = jest.fn();
      const { result } = renderHook(() => useSyncedToast({ onDismiss }));

      act(() => {
        result.current.show(3);
      });

      act(() => {
        result.current.dismiss();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('show function', () => {
    it('manually shows the toast with default count', () => {
      const { result } = renderHook(() => useSyncedToast());

      act(() => {
        result.current.show();
      });

      expect(result.current.visible).toBe(true);
      expect(result.current.syncedCount).toBe(1);
    });

    it('manually shows the toast with specified count', () => {
      const { result } = renderHook(() => useSyncedToast());

      act(() => {
        result.current.show(10);
      });

      expect(result.current.visible).toBe(true);
      expect(result.current.syncedCount).toBe(10);
    });
  });

  describe('options', () => {
    it('accepts duration option without affecting initial state', () => {
      const { result } = renderHook(() => useSyncedToast({ duration: 5000 }));
      expect(result.current.visible).toBe(false);
    });

    it('accepts onDismiss option', () => {
      const onDismiss = jest.fn();
      const { result } = renderHook(() => useSyncedToast({ onDismiss }));
      expect(result.current.visible).toBe(false);
      // onDismiss should be called on dismiss, tested above
    });
  });
});

describe('useSyncedToast integration scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registeredCallback = null;
  });

  it('handles multiple sync completions correctly', () => {
    const { result } = renderHook(() => useSyncedToast());

    // First sync
    act(() => {
      registeredCallback?.({
        failed: 0,
        initiated: true,
        processed: 3,
        skipped: 0,
        succeeded: 3,
      });
    });
    expect(result.current.syncedCount).toBe(3);

    // Dismiss
    act(() => {
      result.current.dismiss();
    });
    expect(result.current.visible).toBe(false);

    // Second sync with different count
    act(() => {
      registeredCallback?.({
        failed: 0,
        initiated: true,
        processed: 7,
        skipped: 0,
        succeeded: 7,
      });
    });
    expect(result.current.visible).toBe(true);
    expect(result.current.syncedCount).toBe(7);
  });

  it('updates count when sync completes while toast is visible', () => {
    const { result } = renderHook(() => useSyncedToast());

    // First sync
    act(() => {
      registeredCallback?.({
        failed: 0,
        initiated: true,
        processed: 3,
        skipped: 0,
        succeeded: 3,
      });
    });
    expect(result.current.syncedCount).toBe(3);

    // Second sync without dismissing
    act(() => {
      registeredCallback?.({
        failed: 0,
        initiated: true,
        processed: 5,
        skipped: 0,
        succeeded: 5,
      });
    });
    expect(result.current.visible).toBe(true);
    expect(result.current.syncedCount).toBe(5);
  });
});
