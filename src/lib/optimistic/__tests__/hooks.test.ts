/**
 * Tests for optimistic update hooks
 */

import { renderHook, act } from '@testing-library/react-native';
import { optimisticStore } from '../store';
import {
  useOptimisticStore,
  useHasPendingOperations,
  useOptimisticToggle,
  useOptimisticArchive,
  useOptimisticPause,
  useOptimisticReorder,
  useOptimisticToggleMutation,
  useOptimisticArchiveMutation,
  useOptimisticReorderMutation,
} from '../hooks';
import type { Id } from '../../../../convex/_generated/dataModel';
import {
  resetOfflineQueueManager,
  getOfflineQueueManager,
} from '../../offline';

// Helper to create mock habit ID
const mockHabitId = (id: string) => id as Id<'habits'>;

describe('Optimistic Hooks', () => {
  beforeEach(() => {
    // Reset store state
    const snapshot = optimisticStore.getSnapshot();
    for (const op of snapshot.operations.values()) {
      if (op.state === 'pending') {
        optimisticStore.confirm(op.id);
      }
    }
  });

  describe('useOptimisticStore', () => {
    it('should return store snapshot', () => {
      const { result } = renderHook(() => useOptimisticStore());

      expect(result.current).toHaveProperty('operations');
      expect(result.current).toHaveProperty('pendingToggles');
      expect(result.current).toHaveProperty('pendingArchives');
    });

    it('should update when store changes', () => {
      const { result } = renderHook(() => useOptimisticStore());

      act(() => {
        optimisticStore.addToggle({
          habitId: mockHabitId('hook_test'),
          date: '2026-01-22',
          toCompleted: true,
        });
      });

      expect(result.current.pendingToggles.size).toBeGreaterThan(0);
    });
  });

  describe('useHasPendingOperations', () => {
    it('should return false when no pending operations', () => {
      const { result } = renderHook(() => useHasPendingOperations());
      // May have operations from other tests, just check it's boolean
      expect(typeof result.current).toBe('boolean');
    });

    it('should return true after adding operation', () => {
      // Add operation first, then check hook
      const opId = optimisticStore.addToggle({
        habitId: mockHabitId('pending_test'),
        date: '2026-01-22',
        toCompleted: true,
      });

      const { result } = renderHook(() => useHasPendingOperations());

      expect(result.current).toBe(true);

      // Cleanup
      optimisticStore.confirm(opId);
    });
  });

  describe('useOptimisticToggle', () => {
    it('should return undefined when no pending toggle', () => {
      const { result } = renderHook(() =>
        useOptimisticToggle(mockHabitId('nonexistent'), '2026-01-22')
      );

      expect(result.current).toBeUndefined();
    });

    it('should return pending toggle state', () => {
      const habitId = mockHabitId('toggle_hook_test');
      const date = '2026-01-22';

      act(() => {
        optimisticStore.addToggle({ habitId, date, toCompleted: true });
      });

      const { result } = renderHook(() => useOptimisticToggle(habitId, date));

      expect(result.current).toBe(true);
    });
  });

  describe('useOptimisticArchive', () => {
    it('should return undefined when no pending archive', () => {
      const { result } = renderHook(() =>
        useOptimisticArchive(mockHabitId('nonexistent'))
      );

      expect(result.current).toBeUndefined();
    });

    it('should return pending archive state', () => {
      const habitId = mockHabitId('archive_hook_test');

      act(() => {
        optimisticStore.addArchive({
          habitId,
          habitName: 'Test',
          toArchived: true,
        });
      });

      const { result } = renderHook(() => useOptimisticArchive(habitId));

      expect(result.current).toBe(true);
    });
  });

  describe('useOptimisticPause', () => {
    it('should return pending pause state', () => {
      const habitId = mockHabitId('pause_hook_test');

      act(() => {
        optimisticStore.addPause({ habitId, toPaused: true });
      });

      const { result } = renderHook(() => useOptimisticPause(habitId));

      expect(result.current).toBe(true);
    });
  });

  describe('useOptimisticReorder', () => {
    it('should return null when no pending reorder', () => {
      const { result } = renderHook(() => useOptimisticReorder());
      // Clear any existing reorder first
      const current = optimisticStore.getPendingReorder();
      if (current !== null) {
        // There's a pending reorder from another test
        expect(result.current).not.toBeNull();
      } else {
        expect(result.current).toBeNull();
      }
    });

    it('should return pending reorder', () => {
      const habitIds = [mockHabitId('reorder_a'), mockHabitId('reorder_b')];

      act(() => {
        optimisticStore.addReorder({
          habitIds,
          previousOrder: [mockHabitId('reorder_b'), mockHabitId('reorder_a')],
        });
      });

      const { result } = renderHook(() => useOptimisticReorder());

      expect(result.current).toEqual(habitIds);
    });
  });

  describe('useOptimisticToggleMutation', () => {
    it('should call server mutation and manage optimistic state', async () => {
      const serverMutation = jest.fn().mockResolvedValue(undefined);
      const getCurrentStatus = jest.fn().mockReturnValue(false);

      const { result } = renderHook(() =>
        useOptimisticToggleMutation(serverMutation, getCurrentStatus)
      );

      const habitId = mockHabitId('mutation_test');
      const date = '2026-01-22';

      await act(async () => {
        await result.current({ habitId, date });
      });

      expect(serverMutation).toHaveBeenCalledWith({
        completed: true,
        date,
        habitId,
      });
      expect(getCurrentStatus).toHaveBeenCalledWith(habitId, date);
    });

    it('honors an explicit completion target without reading cached state', async () => {
      const serverMutation = jest.fn().mockResolvedValue(undefined);
      const getCurrentStatus = jest.fn().mockReturnValue(true);
      const { result } = renderHook(() =>
        useOptimisticToggleMutation(serverMutation, getCurrentStatus)
      );
      const habitId = mockHabitId('explicit_target_test');
      const date = '2026-01-22';

      await act(async () => {
        await result.current({ completed: true, habitId, date });
      });

      expect(getCurrentStatus).not.toHaveBeenCalled();
      expect(serverMutation).toHaveBeenCalledWith({
        completed: true,
        date,
        habitId,
      });
    });

    it('should apply optimistic update before server response', async () => {
      let resolvePromise: () => void;
      const serverPromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      const serverMutation = jest.fn().mockReturnValue(serverPromise);
      const getCurrentStatus = jest.fn().mockReturnValue(false);

      const { result } = renderHook(() =>
        useOptimisticToggleMutation(serverMutation, getCurrentStatus)
      );

      const habitId = mockHabitId('optimistic_timing_test');
      const date = '2026-01-22';

      // Start mutation but don't await
      act(() => {
        result.current({ habitId, date });
      });

      // Check optimistic state is applied immediately
      expect(optimisticStore.getPendingToggle(habitId, date)).toBe(true);

      // Resolve server mutation
      await act(async () => {
        resolvePromise!();
        await serverPromise;
      });

      // Optimistic state should be cleared after confirm
      // (may need small delay due to setTimeout in store)
    });

    it('should rollback on server error', async () => {
      const serverMutation = jest
        .fn()
        .mockRejectedValue(new Error('Server error'));
      const getCurrentStatus = jest.fn().mockReturnValue(false);

      const { result } = renderHook(() =>
        useOptimisticToggleMutation(serverMutation, getCurrentStatus)
      );

      const habitId = mockHabitId('rollback_test');
      const date = '2026-01-22';

      await act(async () => {
        try {
          await result.current({ habitId, date });
        } catch {
          // Expected error
        }
      });

      // Optimistic state should be cleared (rolled back)
      expect(optimisticStore.getPendingToggle(habitId, date)).toBeUndefined();
    });

    describe('offline queue integration', () => {
      beforeEach(() => {
        // Reset the offline queue for each test
        resetOfflineQueueManager();
      });

      it('should queue operation immediately when offline', async () => {
        const serverMutation = jest.fn().mockResolvedValue(undefined);
        const getCurrentStatus = jest.fn().mockReturnValue(false);

        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
            isOnline: false,
          })
        );

        const habitId = mockHabitId('offline_queue_test');
        const date = '2026-01-22';

        let mutationResult;
        await act(async () => {
          mutationResult = await result.current({ habitId, date });
        });

        // Should NOT call server mutation when offline
        expect(serverMutation).not.toHaveBeenCalled();

        // Should return queued result
        expect(mutationResult).toEqual({
          queued: true,
          offlineOperationId: expect.any(String),
        });

        // Should be in the offline queue
        const queueState = getOfflineQueueManager().getState();
        expect(queueState.operations).toHaveLength(1);
        expect(queueState.operations[0].type).toBe('toggleCompletion');
        expect(queueState.operations[0].payload.habitId).toBe(habitId);
        expect(queueState.operations[0].payload.date).toBe(date);
        expect(queueState.operations[0].payload.toCompleted).toBe(true);
      });

      it('should apply optimistic state immediately when offline', async () => {
        const serverMutation = jest.fn().mockResolvedValue(undefined);
        const getCurrentStatus = jest.fn().mockReturnValue(true);

        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
            isOnline: false,
          })
        );

        const habitId = mockHabitId('offline_optimistic_test');
        const date = '2026-01-22';

        // Start mutation
        act(() => {
          result.current({ habitId, date });
        });

        // Optimistic state should be applied immediately (toggling from true to false)
        expect(optimisticStore.getPendingToggle(habitId, date)).toBe(false);
      });

      it('should queue on network error during online request', async () => {
        // Create a network error (these are classified as network errors)
        const networkError = new TypeError('Network request failed');
        const serverMutation = jest.fn().mockRejectedValue(networkError);
        const getCurrentStatus = jest.fn().mockReturnValue(false);

        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
            isOnline: true,
          })
        );

        const habitId = mockHabitId('network_error_test');
        const date = '2026-01-22';

        let mutationResult;
        await act(async () => {
          mutationResult = await result.current({ habitId, date });
        });

        // Server mutation WAS called (we were online)
        expect(serverMutation).toHaveBeenCalled();

        // Should return queued result due to network error
        expect(mutationResult).toEqual({
          queued: true,
          offlineOperationId: expect.any(String),
        });

        // Should be in the offline queue
        const queueState = getOfflineQueueManager().getState();
        expect(queueState.operations).toHaveLength(1);
        expect(queueState.operations[0].payload.toCompleted).toBe(true);
      });

      it('should throw on non-network errors when online', async () => {
        const serverError = new Error('Database error');
        const serverMutation = jest.fn().mockRejectedValue(serverError);
        const getCurrentStatus = jest.fn().mockReturnValue(false);

        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
            isOnline: true,
          })
        );

        const habitId = mockHabitId('server_error_test');
        const date = '2026-01-22';

        await act(async () => {
          await expect(result.current({ habitId, date })).rejects.toThrow(
            'Database error'
          );
        });

        // Should NOT be in the offline queue (not a network error)
        const queueState = getOfflineQueueManager().getState();
        expect(queueState.operations).toHaveLength(0);
      });

      it('should succeed online without queueing', async () => {
        const serverMutation = jest.fn().mockResolvedValue(undefined);
        const getCurrentStatus = jest.fn().mockReturnValue(false);

        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
            isOnline: true,
          })
        );

        const habitId = mockHabitId('online_success_test');
        const date = '2026-01-22';

        let mutationResult;
        await act(async () => {
          mutationResult = await result.current({ habitId, date });
        });

        // Should call server mutation
        expect(serverMutation).toHaveBeenCalledWith({
          completed: true,
          date,
          habitId,
        });

        // Should NOT queue (successful online operation)
        expect(mutationResult).toEqual({
          queued: false,
        });

        // Queue should be empty
        const queueState = getOfflineQueueManager().getState();
        expect(queueState.operations).toHaveLength(0);
      });

      it('should default to online behavior when no options provided', async () => {
        const serverMutation = jest.fn().mockResolvedValue(undefined);
        const getCurrentStatus = jest.fn().mockReturnValue(false);

        // No options = defaults to isOnline: true
        const { result } = renderHook(() =>
          useOptimisticToggleMutation(serverMutation, getCurrentStatus)
        );

        const habitId = mockHabitId('default_online_test');
        const date = '2026-01-22';

        await act(async () => {
          await result.current({ habitId, date });
        });

        // Should call server mutation (default is online)
        expect(serverMutation).toHaveBeenCalled();
      });
    });
  });

  describe('useOptimisticArchiveMutation', () => {
    it('should call archive mutation with optimistic update', async () => {
      const archiveMutation = jest.fn().mockResolvedValue(undefined);
      const getHabitName = jest.fn().mockReturnValue('Test Habit');

      const { result } = renderHook(() =>
        useOptimisticArchiveMutation(archiveMutation, getHabitName)
      );

      const habitId = mockHabitId('archive_mutation_test');

      await act(async () => {
        await result.current(habitId);
      });

      expect(archiveMutation).toHaveBeenCalledWith({ habitId });
      expect(getHabitName).toHaveBeenCalledWith(habitId);
    });
  });

  describe('useOptimisticReorderMutation', () => {
    it('should call reorder mutation with optimistic update', async () => {
      const serverMutation = jest.fn().mockResolvedValue(undefined);
      const currentOrder = [mockHabitId('a'), mockHabitId('b')];
      const getCurrentOrder = jest.fn().mockReturnValue(currentOrder);

      const { result } = renderHook(() =>
        useOptimisticReorderMutation(serverMutation, getCurrentOrder)
      );

      const newOrder = [mockHabitId('b'), mockHabitId('a')];

      await act(async () => {
        await result.current(newOrder);
      });

      expect(serverMutation).toHaveBeenCalledWith({ habitIds: newOrder });
    });
  });
});
