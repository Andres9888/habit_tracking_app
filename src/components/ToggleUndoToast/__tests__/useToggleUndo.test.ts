/**
 * useToggleUndo Hook Tests
 *
 * Comprehensive test coverage for the 3-second undo window hook including:
 * - Basic state management (pending toggle, toast visibility)
 * - Schedule toggle behavior (optimistic state, timer setup)
 * - Undo functionality (timer cancellation, callback invocation)
 * - Auto-commit on timer expiry
 * - Force commit functionality
 * - Multiple toggles (replacing pending toggles)
 * - Edge cases (rapid toggles, cleanup on unmount)
 */

import { renderHook, act } from '@testing-library/react-hooks';
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
      expect(result.current.state.toastVisible).toBe(false);
      expect(result.current.state.dateLabel).toBe('');
    });

    it('provides all expected functions', () => {
      const { result } = renderHook(() => useToggleUndo());

      expect(typeof result.current.scheduleToggle).toBe('function');
      expect(typeof result.current.undoToggle).toBe('function');
      expect(typeof result.current.dismissToast).toBe('function');
      expect(typeof result.current.hasPendingToggle).toBe('function');
      expect(typeof result.current.forceCommit).toBe('function');
    });
  });

  describe('scheduleToggle', () => {
    it('creates a pending toggle with correct data', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      const pending = result.current.state.pendingToggle;
      expect(pending).not.toBeNull();
      expect(pending?.habitId).toBe('habit-123');
      expect(pending?.habitName).toBe('Exercise');
      expect(pending?.date).toBe('2024-12-28');
      expect(pending?.wasCompleted).toBe(true);
    });

    it('shows toast when toggle is scheduled', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.state.toastVisible).toBe(true);
    });

    it('formats date label correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.state.dateLabel).toBe('Dec 28');
    });

    it('returns true when toggle is scheduled', () => {
      const { result } = renderHook(() => useToggleUndo());

      let success: boolean = false;
      act(() => {
        success = result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(success).toBe(true);
    });

    it('generates unique IDs for each toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-1', 'Exercise', '2024-12-28', true);
      });
      const firstId = result.current.state.pendingToggle?.id;

      act(() => {
        result.current.scheduleToggle('habit-2', 'Meditation', '2024-12-29', false);
      });
      const secondId = result.current.state.pendingToggle?.id;

      expect(firstId).toBeDefined();
      expect(secondId).toBeDefined();
      expect(firstId).not.toBe(secondId);
    });

    it('handles uncomplete action (wasCompleted: false)', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', false);
      });

      expect(result.current.state.pendingToggle?.wasCompleted).toBe(false);
    });
  });

  describe('Auto-Commit on Timer Expiry', () => {
    it('calls onCommit after default 3 second window', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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

    it('clears pending toggle and toast after commit', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        jest.advanceTimersByTime(3001);
      });

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('handles async onCommit', async () => {
      const onCommit = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      await act(async () => {
        jest.advanceTimersByTime(3001);
      });

      expect(consoleError).toHaveBeenCalled();
      expect(result.current.state.pendingToggle).toBeNull();
      consoleError.mockRestore();
    });
  });

  describe('undoToggle', () => {
    it('cancels the pending toggle', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.undoToggle();
      });

      expect(result.current.state.pendingToggle).toBeNull();
      expect(result.current.state.toastVisible).toBe(false);
    });

    it('calls onUndo with correct parameters', () => {
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onUndo }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
  });

  describe('dismissToast', () => {
    it('hides the toast', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.state.toastVisible).toBe(true);

      act(() => {
        result.current.dismissToast();
      });

      expect(result.current.state.toastVisible).toBe(false);
    });

    it('does not cancel the pending toggle (timer continues)', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.dismissToast();
      });

      // Pending toggle should still exist
      expect(result.current.state.pendingToggle).not.toBeNull();

      // Timer should still fire
      act(() => {
        jest.advanceTimersByTime(3001);
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasPendingToggle', () => {
    it('returns true for matching habit and date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.hasPendingToggle('habit-123', '2024-12-28')).toBe(true);
    });

    it('returns false for non-matching habit ID', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.hasPendingToggle('habit-456', '2024-12-28')).toBe(false);
    });

    it('returns false for non-matching date', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      expect(result.current.hasPendingToggle('habit-123', '2024-12-29')).toBe(false);
    });

    it('returns false when no pending toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      expect(result.current.hasPendingToggle('habit-123', '2024-12-28')).toBe(false);
    });
  });

  describe('forceCommit', () => {
    it('immediately commits pending toggle', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.forceCommit();
      });

      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-123', '2024-12-28', true);
    });

    it('clears state after force commit', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.forceCommit();
      });

      expect(result.current.state.pendingToggle).toBeNull();
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
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
    it('replaces previous pending toggle with new one', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-1', 'Exercise', '2024-12-28', true);
      });

      const firstId = result.current.state.pendingToggle?.id;

      act(() => {
        result.current.scheduleToggle('habit-2', 'Meditation', '2024-12-29', false);
      });

      expect(result.current.state.pendingToggle?.habitId).toBe('habit-2');
      expect(result.current.state.pendingToggle?.habitName).toBe('Meditation');
      expect(result.current.state.pendingToggle?.id).not.toBe(firstId);
    });

    it('commits previous toggle when scheduling new one', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-1', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.scheduleToggle('habit-2', 'Meditation', '2024-12-29', false);
      });

      // First toggle should have been committed
      expect(onCommit).toHaveBeenCalledTimes(1);
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);
    });

    it('only auto-commits the latest toggle', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-1', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.scheduleToggle('habit-2', 'Meditation', '2024-12-29', false);
      });

      // First toggle committed immediately when replaced
      expect(onCommit).toHaveBeenCalledWith('habit-1', '2024-12-28', true);

      act(() => {
        jest.advanceTimersByTime(3001);
      });

      // Second toggle committed after its timer expires
      expect(onCommit).toHaveBeenCalledTimes(2);
      expect(onCommit).toHaveBeenLastCalledWith('habit-2', '2024-12-29', false);
    });
  });

  describe('Cleanup on Unmount', () => {
    it('clears timer on unmount', () => {
      const onCommit = jest.fn();
      const { result, unmount } = renderHook(() => useToggleUndo({ onCommit }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      unmount();

      // Fast-forward past timer
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should not have been called because hook was unmounted
      expect(onCommit).not.toHaveBeenCalled();
    });
  });

  describe('Date Label Formatting', () => {
    it('formats January date correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-01-15', true);
      });

      expect(result.current.state.dateLabel).toBe('Jan 15');
    });

    it('formats July date correctly', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-07-04', true);
      });

      expect(result.current.state.dateLabel).toBe('Jul 4');
    });

    it('handles invalid date format gracefully', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', 'invalid-date', true);
      });

      // Should return the original string when parsing fails
      expect(result.current.state.dateLabel).toBe('invalid-date');
    });

    it('clears date label when no pending toggle', () => {
      const { result } = renderHook(() => useToggleUndo());

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.undoToggle();
      });

      expect(result.current.state.dateLabel).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggles correctly', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Rapid-fire 5 toggles
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.scheduleToggle(`habit-${i}`, `Habit ${i}`, `2024-12-2${i}`, i % 2 === 0);
        });
      }

      // First 4 toggles should have been committed immediately
      expect(onCommit).toHaveBeenCalledTimes(4);

      // Only the last toggle should be pending
      expect(result.current.state.pendingToggle?.habitId).toBe('habit-4');
    });

    it('handles toggling the same habit twice', () => {
      const onCommit = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit }));

      // Complete
      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      // Uncomplete
      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', false);
      });

      // First toggle committed immediately
      expect(onCommit).toHaveBeenCalledWith('habit-123', '2024-12-28', true);

      // Second toggle is now pending
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
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      // Should not crash
      act(() => {
        result.current.undoToggle();
      });

      act(() => {
        result.current.scheduleToggle('habit-456', 'Meditation', '2024-12-29', false);
      });

      // Should not crash on auto-commit
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });

    it('handles undo after dismiss (timer still runs)', () => {
      const onCommit = jest.fn();
      const onUndo = jest.fn();
      const { result } = renderHook(() => useToggleUndo({ onCommit, onUndo }));

      act(() => {
        result.current.scheduleToggle('habit-123', 'Exercise', '2024-12-28', true);
      });

      act(() => {
        result.current.dismissToast();
      });

      // Toast is hidden but pending toggle still exists
      act(() => {
        result.current.undoToggle();
      });

      // Undo should still work
      expect(onUndo).toHaveBeenCalledTimes(1);

      // Timer should have been cancelled
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onCommit).not.toHaveBeenCalled();
    });
  });

  describe('State Stability', () => {
    it('maintains stable function references across renders', () => {
      const { result, rerender } = renderHook(() => useToggleUndo());

      const initialScheduleToggle = result.current.scheduleToggle;
      const initialUndoToggle = result.current.undoToggle;
      const initialDismissToast = result.current.dismissToast;
      const initialHasPendingToggle = result.current.hasPendingToggle;
      const initialForceCommit = result.current.forceCommit;

      rerender();

      expect(result.current.scheduleToggle).toBe(initialScheduleToggle);
      expect(result.current.undoToggle).toBe(initialUndoToggle);
      expect(result.current.dismissToast).toBe(initialDismissToast);
      expect(result.current.hasPendingToggle).toBe(initialHasPendingToggle);
      expect(result.current.forceCommit).toBe(initialForceCommit);
    });
  });
});
