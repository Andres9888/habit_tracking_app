/**
 * useToggleUndo Hook Tests
 *
 * Comprehensive test coverage for the 3-second undo window hook including:
 * - Basic state management (pending toggle, toast visibility)
 * - Schedule toggle behavior (optimistic state, timer setup)
 * - Undo functionality (timer cancellation, callback invocation)
 * - Auto-commit on timer expiry
 * - Force commit functionality
 * - Queue-based multiple toggles (rapid toggle support)
 * - undoAll functionality for clearing entire queue
 * - Max queue size enforcement
 * - Edge cases (rapid toggles, cleanup on unmount)
 * - Navigation handling (commit on unmount, app background)
 */

import { renderHook, act } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';
import { useToggleUndo, UseToggleUndoOptions } from '../useToggleUndo';

describe('useToggleUndo', () => {
  // Use fake timers for testing auto-commit
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('initializes with no pending toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.pendingToggles).toEqual([]);
      expect(result.current.state.toastVisible).toBe(false);
      expect(result.current.state.dateLabel).toBe('');
      expect(result.current.state.queueLength).toBe(0);
    });

    it('provides all expected functions', () => {
      const { result } = renderHook(() => useToggleUndo());

      expect(typeof result.current.scheduleToggle).toBe('function');
      expect(typeof result.current.undoToggle).toBe('function');
      expect(typeof result.current.undoAll).toBe('function');
      expect(typeof result.current.dismissToast).toBe('function');
      expect(typeof result.current.hasPendingToggle).toBe('function');
      expect(typeof result.current.getPendingToggle).toBe('function');
      expect(typeof result.current.forceCommit).toBe('function');
    });
  });

  describe('scheduleToggle', () => {
    it('creates a pending toggle with correct data', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      const pending = result.current.state.pendingToggle;
      expect(pending).not.toBeNull();
      expect(pending?.habitId).toBe('habit-123');
      expect(pending?.habitName).toBe('Exercise');
      expect(pending?.date).toBe('2024-12-28');
      expect(pending?.wasCompleted).toBe(true);
      expect(result.current.state.queueLength).toBe(1);
    });

    it('shows toast when toggle is scheduled', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.state.toastVisible).toBe(true);
    });

    it('formats date label correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.state.dateLabel).toBe('Dec 28');
    });

    it('returns true when toggle is scheduled', () => {
      const { result } = renderHook(() => useToggleUndo());

      let success: boolean = false;
      act(() => {
        success = result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(success).toBe(true);
    });

    it('generates unique IDs for each toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      const firstId = result.current.state.pendingToggle?.id;

      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });
      const secondId = result.current.state.pendingToggle?.id;

      expect(firstId).toBeDefined();
      expect(secondId).toBeDefined();
      expect(firstId).not.toBe(secondId);
      // Both should be in queue now (different habit+date)
      expect(result.current.state.queueLength).toBe(2);
    });

    it('handles uncomplete action (wasCompleted: false)', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          false
        );
      });

      expect(result.current.state.pendingToggle?.wasCompleted).toBe(false);
    });
  });

  describe('Auto-Commit on Timer Expiry', () => {
    it('calls onCommit after default 3 second window', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Before timer expires
      act(() => {
        jest.advanceTimersByTime(2999);
      });
      expect(onCommit).not.toHaveBeenCalled();

      // After timer expires
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-123', '2024-12-28', true);
    });

    it('respects custom undoWindowMs', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, undoWindowMs: 5000 })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Default window (3s) passed but custom hasn't
      act(() => {
        jest.advanceTimersByTime(3500);
      });
      expect(onCommit).not.toHaveBeenCalled();

      // Custom window passed
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onCommit).toHaveBeenCalledTimes(1);
    });

    it('clears pending toggle and toast after commit', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      await act(async () => {
        jest.advanceTimersByTime(3001);
      });

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('handles async onCommit', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      await act(async () => {
        jest.advanceTimersByTime(3001);
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
    });

    it('handles onCommit errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const onCommit = jest.fn().mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      await act(async () => {
        jest.advanceTimersByTime(3001);
      });

      expect(consoleError).toHaveBeenCalled();
      expect(result.current.state.pendingToggle).toBeNull();
      consoleError.mockRestore();
    });

    it('commits each queued toggle independently on its own timer', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Schedule first toggle
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Wait 1 second, then schedule second toggle
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // After 2 more seconds (3s total for first), first should commit
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(result.current.state.queueLength).toBe(1);

      // After 1 more second (3s total for second), second should commit
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenLastCalledWith('habit-2', '2024-12-29', false);
      expect(result.current.state.queueLength).toBe(0);
    });
  });

  describe('undoToggle', () => {
    it('cancels the most recent pending toggle', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.undoToggle();
      });

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('calls onUndo with correct parameters for most recent toggle', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.undoToggle();
      });

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onUndo).toHaveBeenCalledWith('habit-123', '2024-12-28', true);
    });

    it('prevents onCommit from being called after undo', () => {
      const onCommit = jest.fn();
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit, onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.undoToggle();
      });

      // Fast-forward past original timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onCommit).not.toHaveBeenCalled();
    });

    it('returns true when undo is performed', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      let success: boolean = false;
      act(() => {
        success = result.current.undoToggle();
      });

      expect(success).toBe(true);
    });

    it('returns false when there is nothing to undo', () => {
      const { result } = renderHook(() => useToggleUndo());

      let success: boolean = true;
      act(() => {
        success = result.current.undoToggle();
      });

      expect(success).toBe(false);
    });

    it('undoes only the most recent toggle from queue', () => {
      const onUndo = jest.fn();
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo, onCommit }));

      // Add two toggles to queue
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      expect(result.current.state.queueLength).toBe(2);

      // Undo should remove the most recent (habit-2)
      act(() => {
        result.current.undoToggle();
      });

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onUndo).toHaveBeenCalledWith('habit-2', '2024-12-29', false);
      expect(result.current.state.queueLength).toBe(1);
      expect(result.current.state.pendingToggle?.habitId).toBe('habit-1');
      expect(result.current.state.toastVisible).toBe(true); // Still has one in queue

      // Undo the first one
      act(() => {
        result.current.undoToggle();
      });

      expect(onUndo).toHaveBeenCalledTimes(2);
      expect(onUndo).toHaveBeenLastCalledWith('habit-1', '2024-12-28', true);
      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });
  });

  describe('dismissToast', () => {
    it('hides the toast', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.state.toastVisible).toBe(true);

      act(() => {
        result.current.dismissToast();
      });

      expect(result.current.state.toastVisible).toBe(false);
    });

    it('does not cancel pending toggles (all timers continue)', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      act(() => {
        result.current.dismissToast();
      });

      // Queue should still have both toggles
      expect(result.current.state.queueLength).toBe(2);

      // Timers should still fire for all
      act(() => {
        jest.advanceTimersByTime(3001);
      });

      expect(onCommit).toHaveBeenCalledTimes(2);
    });
  });

  describe('hasPendingToggle', () => {
    it('returns true for matching habit and date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.hasPendingToggle('habit-123', '2024-12-28')).toBe(
        true
      );
    });

    it('returns false for non-matching habit ID', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.hasPendingToggle('habit-456', '2024-12-28')).toBe(
        false
      );
    });

    it('returns false for non-matching date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.hasPendingToggle('habit-123', '2024-12-29')).toBe(
        false
      );
    });

    it('returns false when no pending toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      expect(result.current.hasPendingToggle('habit-123', '2024-12-28')).toBe(
        false
      );
    });
  });

  describe('forceCommit', () => {
    it('immediately commits all pending toggles', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      act(() => {
        result.current.forceCommit();
      });

      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(onCommit).toHaveBeenCalledWith('habit-2', '2024-12-29', false);
    });

    it('clears state after force commit', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.forceCommit();
      });

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('does nothing when no pending toggle', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.forceCommit();
      });

      expect(onCommit).not.toHaveBeenCalled();
    });

    it('prevents auto-commit after force commit', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.forceCommit();
      });

      // Fast-forward past original timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should only have been called once (force commit)
      expect(onCommit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Toggles (Queuing)', () => {
    it('queues multiple toggles for different habits', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // Both should be in queue
      expect(result.current.state.queueLength).toBe(2);
      // Most recent should be displayed
      expect(result.current.state.pendingToggle?.habitId).toBe('habit-2');
      // Both should be accessible
      expect(result.current.state.pendingToggles).toHaveLength(2);
      expect(result.current.state.pendingToggles[0].habitId).toBe('habit-1');
      expect(result.current.state.pendingToggles[1].habitId).toBe('habit-2');
    });

    it('replaces toggle for same habit+date instead of queuing', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Complete a habit
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Toggle it again (uncomplete)
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          false
        );
      });

      // Should still only have 1 in queue (replaced)
      expect(result.current.state.queueLength).toBe(1);
      expect(result.current.state.pendingToggle?.wasCompleted).toBe(false);
      // First toggle committed when replaced
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
    });

    it('auto-commits each queued toggle independently', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Add first toggle
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Wait 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Add second toggle (1s after first)
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      expect(result.current.state.queueLength).toBe(2);

      // After 2 more seconds (3s total for first)
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // First should be committed
      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(result.current.state.queueLength).toBe(1);

      // After 1 more second (3s total for second)
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Second should be committed
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenLastCalledWith('habit-2', '2024-12-29', false);
      expect(result.current.state.queueLength).toBe(0);
    });

    it('respects maxQueueSize and commits oldest when exceeded', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, maxQueueSize: 3 })
      );

      // Add 3 toggles to fill queue
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });
      act(() => {
        result.current.scheduleToggle('habit-3', 'Reading', '2024-12-30', true);
      });

      expect(result.current.state.queueLength).toBe(3);
      expect(onCommit).not.toHaveBeenCalled();

      // Add 4th toggle - should commit oldest
      act(() => {
        result.current.scheduleToggle(
          'habit-4',
          'Writing',
          '2024-12-31',
          false
        );
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(result.current.state.queueLength).toBe(3);
      expect(result.current.state.pendingToggles[0].habitId).toBe('habit-2');
    });
  });

  describe('undoAll', () => {
    it('undoes all pending toggles', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });
      act(() => {
        result.current.scheduleToggle('habit-3', 'Reading', '2024-12-30', true);
      });

      let count: number = 0;
      act(() => {
        count = result.current.undoAll();
      });

      expect(count).toBe(3);
      expect(onUndo).toHaveBeenCalledTimes(3);
      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('returns 0 when queue is empty', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      let count: number = 0;
      act(() => {
        count = result.current.undoAll();
      });

      expect(count).toBe(0);
      expect(onUndo).not.toHaveBeenCalled();
    });

    it('cancels all timers when undoing all', () => {
      const onCommit = jest.fn();
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit, onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      act(() => {
        result.current.undoAll();
      });

      // Fast-forward past all timers
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // onCommit should not have been called
      expect(onCommit).not.toHaveBeenCalled();
      expect(onUndo).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPendingToggle', () => {
    it('returns the pending toggle for matching habit+date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      const toggle = result.current.getPendingToggle('habit-1', '2024-12-28');
      expect(toggle).toBeDefined();
      expect(toggle?.habitId).toBe('habit-1');
      expect(toggle?.habitName).toBe('Exercise');
      expect(toggle?.wasCompleted).toBe(true);
    });

    it('returns undefined for non-matching habit+date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(
        result.current.getPendingToggle('habit-2', '2024-12-28')
      ).toBeUndefined();
      expect(
        result.current.getPendingToggle('habit-1', '2024-12-29')
      ).toBeUndefined();
    });
  });

  describe('Cleanup on Unmount', () => {
    it('commits all pending toggles on unmount by default', () => {
      const onCommit = jest.fn();
      const { result, unmount } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      unmount();

      // All pending toggles are committed on unmount by default
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(onCommit).toHaveBeenCalledWith('habit-2', '2024-12-29', false);

      // Fast-forward past all timers - no additional commits should occur
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should still only be 2 (from unmount), not 4
      expect(onCommit).toHaveBeenCalledTimes(2);
    });
  });

  describe('Date Label Formatting', () => {
    it('formats January date correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-01-15',
          true
        );
      });

      expect(result.current.state.dateLabel).toBe('Jan 15');
    });

    it('formats July date correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-07-04',
          true
        );
      });

      expect(result.current.state.dateLabel).toBe('Jul 4');
    });

    it('handles invalid date format gracefully', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          'invalid-date',
          true
        );
      });

      // Should return the original string when parsing fails
      expect(result.current.state.dateLabel).toBe('invalid-date');
    });

    it('clears date label when no pending toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.undoToggle();
      });

      expect(result.current.state.dateLabel).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggles correctly with queue', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Rapid-fire 5 toggles for different habits
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.scheduleToggle(
            `habit-${i}`,
            `Habit ${i}`,
            `2024-12-2${i}`,
            i % 2 === 0
          );
        });
      }

      // All 5 should be in queue (different habit+date combos)
      expect(result.current.state.queueLength).toBe(5);
      expect(onCommit).not.toHaveBeenCalled();

      // Most recent should be displayed
      expect(result.current.state.pendingToggle?.habitId).toBe('habit-4');
    });

    it('handles toggling the same habit twice (replaces in queue)', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Complete
      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Uncomplete (same habit+date)
      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          false
        );
      });

      // First toggle committed when replaced
      expect(onCommit).toHaveBeenCalledWith('habit-123', '2024-12-28', true);

      // Only the second toggle should be pending
      expect(result.current.state.queueLength).toBe(1);
      expect(result.current.state.pendingToggle?.wasCompleted).toBe(false);
    });

    it('handles empty habit name', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', '', '2024-12-28', true);
      });

      expect(result.current.state.pendingToggle?.habitName).toBe('');
    });

    it('handles options without callbacks', () => {
      const { result } = renderHook(() => useToggleUndo({}));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Should not crash
      act(() => {
        result.current.undoToggle();
      });

      act(() => {
        result.current.scheduleToggle(
          'habit-456',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // Should not crash on auto-commit
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });

    it('handles undo after dismiss (timers still run)', () => {
      const onCommit = jest.fn();
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit, onUndo }));

      act(() => {
        result.current.scheduleToggle(
          'habit-123',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        result.current.dismissToast();
      });

      // Toast is hidden but pending toggle still exists
      expect(result.current.state.queueLength).toBe(1);

      act(() => {
        result.current.undoToggle();
      });

      // Undo should still work
      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(result.current.state.queueLength).toBe(0);

      // Timer should have been cancelled
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onCommit).not.toHaveBeenCalled();
    });

    it('handles mixed queue of same and different habits', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Add habit-1 for date 28
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      // Add habit-2 for date 29
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });
      // Toggle habit-1 for date 28 again (should replace)
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          false
        );
      });

      // First habit-1 toggle should be committed
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(onCommit).toHaveBeenCalledTimes(1);

      // Queue should have 2 items: habit-2 and new habit-1
      expect(result.current.state.queueLength).toBe(2);
      expect(result.current.state.pendingToggles[0].habitId).toBe('habit-2');
      expect(result.current.state.pendingToggles[1].habitId).toBe('habit-1');
    });
  });

  describe('State Stability', () => {
    it('maintains stable function references across renders', () => {
      const { result, rerender } = renderHook(() => useToggleUndo());

      const initialScheduleToggle = result.current.scheduleToggle;
      const initialUndoToggle = result.current.undoToggle;
      const initialUndoAll = result.current.undoAll;
      const initialDismissToast = result.current.dismissToast;
      const initialHasPendingToggle = result.current.hasPendingToggle;
      const initialGetPendingToggle = result.current.getPendingToggle;
      const initialForceCommit = result.current.forceCommit;

      rerender();

      expect(result.current.scheduleToggle).toBe(initialScheduleToggle);
      expect(result.current.undoToggle).toBe(initialUndoToggle);
      expect(result.current.undoAll).toBe(initialUndoAll);
      expect(result.current.dismissToast).toBe(initialDismissToast);
      expect(result.current.hasPendingToggle).toBe(initialHasPendingToggle);
      expect(result.current.getPendingToggle).toBe(initialGetPendingToggle);
      expect(result.current.forceCommit).toBe(initialForceCommit);
    });
  });

  describe('Navigation Handling - Commit on Unmount', () => {
    it('commits pending toggles on unmount by default', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      unmount();

      // Both toggles should be committed
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      expect(onCommit).toHaveBeenCalledWith('habit-2', '2024-12-29', false);
    });

    it('calls onNavigationCommit with unmount reason', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      unmount();

      expect(onNavigationCommit).toHaveBeenCalledTimes(1);
      expect(onNavigationCommit).toHaveBeenCalledWith(
        'unmount',
        2,
        expect.arrayContaining([
          expect.objectContaining({ habitId: 'habit-1' }),
          expect.objectContaining({ habitId: 'habit-2' }),
        ])
      );
    });

    it('does not commit on unmount when commitOnUnmount is false', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit, commitOnUnmount: false })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      unmount();

      // Should not commit - toggle is lost
      expect(onCommit).not.toHaveBeenCalled();
      expect(onNavigationCommit).not.toHaveBeenCalled();
    });

    it('does nothing on unmount when queue is empty', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      unmount();

      expect(onCommit).not.toHaveBeenCalled();
      expect(onNavigationCommit).not.toHaveBeenCalled();
    });

    it('clears timers on unmount even when not committing', () => {
      const onCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, commitOnUnmount: false })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      unmount();

      // Fast-forward past timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Timer should have been cleared, no commit
      expect(onCommit).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Handling - Commit on Background', () => {
    let appStateListeners: Array<(state: AppStateStatus) => void> = [];
    let mockAddEventListener: jest.SpyInstance;
    let mockRemove: jest.Mock;

    beforeEach(() => {
      appStateListeners = [];
      mockRemove = jest.fn();
      mockAddEventListener = jest.spyOn(AppState, 'addEventListener').mockImplementation(
        (type: string, listener: (state: AppStateStatus) => void) => {
          if (type === 'change') {
            appStateListeners.push(listener);
          }
          return { remove: mockRemove };
        }
      );
      // Mock AppState.currentState
      Object.defineProperty(AppState, 'currentState', {
        value: 'active',
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      mockAddEventListener.mockRestore();
    });

    it('commits pending toggles when app goes to background', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Simulate app going to background
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
    });

    it('calls onNavigationCommit with background reason', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onNavigationCommit).toHaveBeenCalledTimes(1);
      expect(onNavigationCommit).toHaveBeenCalledWith(
        'background',
        1,
        expect.arrayContaining([
          expect.objectContaining({ habitId: 'habit-1' }),
        ])
      );
    });

    it('commits when app goes to inactive state', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Simulate app going to inactive (iOS specific - before background)
      act(() => {
        appStateListeners.forEach((listener) => listener('inactive'));
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
    });

    it('does not commit when commitOnBackground is false', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, commitOnBackground: false })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onCommit).not.toHaveBeenCalled();
    });

    it('does not commit when app comes to foreground', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Simulate coming back to active (should not trigger commit)
      act(() => {
        appStateListeners.forEach((listener) => listener('active'));
      });

      expect(onCommit).not.toHaveBeenCalled();
    });

    it('does nothing when going to background with empty queue', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      renderHook(() => useToggleUndo({ onCommit, onNavigationCommit }));

      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onCommit).not.toHaveBeenCalled();
      expect(onNavigationCommit).not.toHaveBeenCalled();
    });

    it('removes AppState listener on unmount', () => {
      const { unmount } = renderHook(() =>
        useToggleUndo({ commitOnBackground: true })
      );

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });

    it('does not add AppState listener when commitOnBackground is false', () => {
      renderHook(() => useToggleUndo({ commitOnBackground: false }));

      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    it('clears pending queue and toast after background commit', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      expect(result.current.state.queueLength).toBe(1);
      expect(result.current.state.toastVisible).toBe(true);

      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(result.current.state.queueLength).toBe(0);
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('handles rapid background/foreground transitions', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // First background - commits
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });
      expect(onCommit).toHaveBeenCalledTimes(1);

      // Come back to foreground
      act(() => {
        appStateListeners.forEach((listener) => listener('active'));
      });

      // Schedule another toggle
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // Second background - commits the new toggle
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenLastCalledWith('habit-2', '2024-12-29', false);
    });
  });

  describe('Navigation Handling - Combined Scenarios', () => {
    let appStateListeners: Array<(state: AppStateStatus) => void> = [];
    let mockAddEventListener: jest.SpyInstance;

    beforeEach(() => {
      appStateListeners = [];
      mockAddEventListener = jest.spyOn(AppState, 'addEventListener').mockImplementation(
        (type: string, listener: (state: AppStateStatus) => void) => {
          if (type === 'change') {
            appStateListeners.push(listener);
          }
          return { remove: jest.fn() };
        }
      );
      Object.defineProperty(AppState, 'currentState', {
        value: 'active',
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      mockAddEventListener.mockRestore();
    });

    it('does not double-commit on background then unmount', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Go to background first
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onNavigationCommit).toHaveBeenCalledWith('background', 1, expect.any(Array));

      // Then unmount (should not commit again since queue is empty)
      unmount();

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onNavigationCommit).toHaveBeenCalledTimes(1);
    });

    it('commits remaining toggles on unmount after partial background commit', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Go to background - commits first toggle
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });
      expect(onCommit).toHaveBeenCalledTimes(1);

      // Come back, add another toggle
      act(() => {
        appStateListeners.forEach((listener) => listener('active'));
      });
      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // Unmount - should commit the new toggle
      unmount();

      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onNavigationCommit).toHaveBeenCalledTimes(2);
      expect(onNavigationCommit).toHaveBeenLastCalledWith(
        'unmount',
        1,
        expect.arrayContaining([expect.objectContaining({ habitId: 'habit-2' })])
      );
    });

    it('handles both commitOnUnmount and commitOnBackground being false', () => {
      const onCommit = jest.fn();
      const onNavigationCommit = jest.fn();
      const { result, unmount } = renderHook(() =>
        useToggleUndo({
          onCommit,
          onNavigationCommit,
          commitOnUnmount: false,
          commitOnBackground: false,
        })
      );

      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      // Neither should trigger commit
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });
      unmount();

      expect(onCommit).not.toHaveBeenCalled();
      expect(onNavigationCommit).not.toHaveBeenCalled();
    });

    it('timer commits still work independently of navigation commits', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const onNavigationCommit = jest.fn();
      const { result } = renderHook(() =>
        useToggleUndo({ onCommit, onNavigationCommit })
      );

      // Add two toggles with staggered timers
      act(() => {
        result.current.scheduleToggle(
          'habit-1',
          'Exercise',
          '2024-12-28',
          true
        );
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      act(() => {
        result.current.scheduleToggle(
          'habit-2',
          'Meditation',
          '2024-12-29',
          false
        );
      });

      // First timer expires after 1.5 more seconds
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
      // Timer commits don't trigger onNavigationCommit
      expect(onNavigationCommit).not.toHaveBeenCalled();

      // Go to background - commits remaining toggle
      act(() => {
        appStateListeners.forEach((listener) => listener('background'));
      });

      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onNavigationCommit).toHaveBeenCalledTimes(1);
      expect(onNavigationCommit).toHaveBeenCalledWith(
        'background',
        1,
        expect.any(Array)
      );
    });
  });
});
