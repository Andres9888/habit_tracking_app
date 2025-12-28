/**
 * useToggleUndo Hook
 *
 * Manages habit toggle actions with a 3-second undo window.
 * Uses an "optimistic with delayed commit" pattern:
 * - UI updates immediately (optimistic state)
 * - Backend mutation is delayed by the undo window duration
 * - If undone, mutation is cancelled and never sent
 * - If timer expires, mutation is committed to backend
 *
 * Supports queuing of multiple rapid toggles:
 * - Each toggle gets its own undo timer
 * - Most recent toggle is displayed in the toast
 * - Undo pops the most recent toggle from the queue
 * - undoAll() clears the entire queue
 *
 * Navigation handling:
 * - Pending toggles are auto-committed when component unmounts (configurable)
 * - App backgrounding triggers auto-commit (configurable)
 * - Provides callbacks for navigation-triggered commits
 *
 * This hook should be used at a screen/context level to manage
 * toggle undo state across multiple components.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { format } from 'date-fns';

export interface PendingToggle {
  /** Unique identifier for this pending toggle */
  id: string;
  /** ID of the habit being toggled */
  habitId: string;
  /** Name of the habit for display */
  habitName: string;
  /** The date being toggled (YYYY-MM-DD format) */
  date: string;
  /** Whether this toggle marked the habit as completed (true) or uncompleted (false) */
  wasCompleted: boolean;
  /** Timestamp when the toggle was initiated */
  timestamp: number;
  /** Timer ID for the delayed commit */
  timerId: NodeJS.Timeout;
}

export interface ToggleUndoState {
  /** The current pending toggle (most recent) for display */
  pendingToggle: PendingToggle | null;
  /** All pending toggles in the queue (oldest first) */
  pendingToggles: PendingToggle[];
  /** Whether the toast should be visible */
  toastVisible: boolean;
  /** Formatted date label for display (e.g., "Dec 28") */
  dateLabel: string;
  /** Number of pending toggles in the queue */
  queueLength: number;
}

/** Reason why toggles were auto-committed */
export type NavigationCommitReason = 'unmount' | 'background' | 'manual';

export interface UseToggleUndoOptions {
  /** Duration of the undo window in ms (default: 3000) */
  undoWindowMs?: number;
  /** Maximum number of toggles that can be queued (default: 10) */
  maxQueueSize?: number;
  /** Callback when a toggle is committed (timer expired without undo) */
  onCommit?: (
    habitId: string,
    date: string,
    wasCompleted: boolean
  ) => void | Promise<void>;
  /** Callback when a toggle is undone */
  onUndo?: (habitId: string, date: string, wasCompleted: boolean) => void;
  /**
   * Auto-commit pending toggles when component unmounts (default: true).
   * When true, pending toggles are committed before cleanup to prevent data loss.
   * Set to false if you want to cancel pending toggles on navigation.
   */
  commitOnUnmount?: boolean;
  /**
   * Auto-commit pending toggles when app goes to background (default: true).
   * When true, pending toggles are committed when AppState changes to 'background'.
   * This ensures toggles are persisted even if the app is killed while backgrounded.
   */
  commitOnBackground?: boolean;
  /**
   * Callback when toggles are auto-committed due to navigation events.
   * Called with the reason ('unmount' | 'background') and the number of toggles committed.
   * Useful for analytics or showing feedback to the user.
   */
  onNavigationCommit?: (
    reason: NavigationCommitReason,
    count: number,
    toggles: PendingToggle[]
  ) => void;
}

export interface UseToggleUndoReturn {
  /** Current state of the undo system */
  state: ToggleUndoState;
  /**
   * Schedule a toggle with undo capability.
   * Returns true if the toggle was scheduled.
   */
  scheduleToggle: (
    habitId: string,
    habitName: string,
    date: string,
    wasCompleted: boolean
  ) => boolean;
  /**
   * Undo the most recent pending toggle.
   * Returns true if an undo was performed, false if there was nothing to undo.
   */
  undoToggle: () => boolean;
  /**
   * Undo all pending toggles in the queue.
   * Returns the number of toggles that were undone.
   */
  undoAll: () => number;
  /**
   * Dismiss the toast without undoing (timer continues for all queued toggles).
   */
  dismissToast: () => void;
  /**
   * Check if a specific habit+date has a pending toggle.
   */
  hasPendingToggle: (habitId: string, date: string) => boolean;
  /**
   * Force commit all pending toggles immediately.
   */
  forceCommit: () => void;
  /**
   * Get the pending toggle for a specific habit+date, if any.
   */
  getPendingToggle: (
    habitId: string,
    date: string
  ) => PendingToggle | undefined;
}

const DEFAULT_UNDO_WINDOW_MS = 3000;
const DEFAULT_MAX_QUEUE_SIZE = 10;

/**
 * Format a date string (YYYY-MM-DD) to a readable label (e.g., "Dec 28")
 */
function formatDateLabel(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, 'MMM d');
  } catch {
    return dateStr;
  }
}

/**
 * Generate a unique ID for a pending toggle
 */
function generateToggleId(): string {
  return `toggle_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function useToggleUndo(
  options: UseToggleUndoOptions = {}
): UseToggleUndoReturn {
  const {
    undoWindowMs = DEFAULT_UNDO_WINDOW_MS,
    maxQueueSize = DEFAULT_MAX_QUEUE_SIZE,
    onCommit,
    onUndo,
    commitOnUnmount = true,
    commitOnBackground = true,
    onNavigationCommit,
  } = options;

  // Queue of pending toggles (oldest first)
  const [pendingToggles, setPendingToggles] = useState<PendingToggle[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  // Use ref to track latest queue for cleanup and timer callbacks
  const pendingTogglesRef = useRef<PendingToggle[]>([]);

  // Track previous app state for background detection
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Keep ref in sync with state
  useEffect(() => {
    pendingTogglesRef.current = pendingToggles;
  }, [pendingToggles]);

  /**
   * Commit all pending toggles with a specific reason.
   * Used for navigation events (unmount, background).
   */
  const commitAllWithReason = useCallback(
    (reason: NavigationCommitReason) => {
      const queue = pendingTogglesRef.current;
      if (queue.length === 0) {
        return;
      }

      const count = queue.length;
      const togglesCopy = [...queue];

      // Clear all timers and commit each toggle
      for (const toggle of queue) {
        clearTimeout(toggle.timerId);
        onCommit?.(toggle.habitId, toggle.date, toggle.wasCompleted);
      }

      // Notify consumer of navigation commit
      onNavigationCommit?.(reason, count, togglesCopy);

      // Clear the queue
      setPendingToggles([]);
      setToastVisible(false);
    },
    [onCommit, onNavigationCommit]
  );

  // Handle app state changes (background/foreground)
  useEffect(() => {
    if (!commitOnBackground) {
      return;
    }

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Commit when moving from active to background
      if (
        appStateRef.current === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        commitAllWithReason('background');
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [commitOnBackground, commitAllWithReason]);

  // Cleanup on unmount - commit or clear pending toggles
  useEffect(() => {
    return () => {
      const queue = pendingTogglesRef.current;
      if (queue.length === 0) {
        return;
      }

      if (commitOnUnmount) {
        // Commit all pending toggles before unmounting
        const togglesCopy = [...queue];
        for (const toggle of queue) {
          clearTimeout(toggle.timerId);
          onCommit?.(toggle.habitId, toggle.date, toggle.wasCompleted);
        }
        onNavigationCommit?.('unmount', queue.length, togglesCopy);
      } else {
        // Just clear timers without committing (data is lost)
        for (const toggle of queue) {
          clearTimeout(toggle.timerId);
        }
      }
    };
    // Note: We intentionally only run this on unmount, so we use refs for values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Remove a toggle from the queue by ID and commit it
   */
  const commitToggleById = useCallback(
    async (toggleId: string) => {
      const queue = pendingTogglesRef.current;
      const toggle = queue.find((t) => t.id === toggleId);

      if (!toggle) {
        return; // Already removed (undone)
      }

      try {
        await onCommit?.(toggle.habitId, toggle.date, toggle.wasCompleted);
      } catch (error) {
        console.error('Failed to commit toggle:', error);
      } finally {
        // Remove from queue
        setPendingToggles((prev) => {
          const newQueue = prev.filter((t) => t.id !== toggleId);
          // Hide toast if queue is now empty
          if (newQueue.length === 0) {
            setToastVisible(false);
          }
          return newQueue;
        });
      }
    },
    [onCommit]
  );

  /**
   * Schedule a toggle with undo capability
   */
  const scheduleToggle = useCallback(
    (
      habitId: string,
      habitName: string,
      date: string,
      wasCompleted: boolean
    ): boolean => {
      const currentQueue = pendingTogglesRef.current;

      // Check if there's already a pending toggle for the same habit+date
      // If so, remove it (cancels out) and add the new one
      const existingIndex = currentQueue.findIndex(
        (t) => t.habitId === habitId && t.date === date
      );

      if (existingIndex !== -1) {
        const existing = currentQueue[existingIndex];
        clearTimeout(existing.timerId);

        // If toggling back to original state (undo equivalent), just remove it
        if (existing.wasCompleted !== wasCompleted) {
          // Cancel each other out - commit the existing one immediately
          // since the user wants the opposite action now
          onCommit?.(existing.habitId, existing.date, existing.wasCompleted);
        }

        // Remove the existing toggle for this habit+date
        setPendingToggles((prev) => prev.filter((t) => t.id !== existing.id));
      }

      // If queue is at max capacity, commit the oldest toggle
      if (currentQueue.length >= maxQueueSize && existingIndex === -1) {
        const oldest = currentQueue[0];
        if (oldest) {
          clearTimeout(oldest.timerId);
          onCommit?.(oldest.habitId, oldest.date, oldest.wasCompleted);
          setPendingToggles((prev) => prev.slice(1));
        }
      }

      // Create the new toggle ID before the closure to ensure we track the right one
      const newToggleId = generateToggleId();

      // Create new pending toggle with its own timer
      const timerId = setTimeout(() => {
        commitToggleById(newToggleId);
      }, undoWindowMs);

      const newToggle: PendingToggle = {
        date,
        habitId,
        habitName,
        id: newToggleId,
        timerId,
        timestamp: Date.now(),
        wasCompleted,
      };

      // Add to queue
      setPendingToggles((prev) => {
        // Filter out any existing toggle for same habit+date
        const filtered = prev.filter(
          (t) => !(t.habitId === habitId && t.date === date)
        );
        return [...filtered, newToggle];
      });
      setToastVisible(true);

      return true;
    },
    [undoWindowMs, maxQueueSize, onCommit, commitToggleById]
  );

  /**
   * Undo the most recent pending toggle
   */
  const undoToggle = useCallback((): boolean => {
    const queue = pendingTogglesRef.current;
    if (queue.length === 0) {
      return false;
    }

    // Get the most recent toggle (last in queue)
    const mostRecent = queue.at(-1);

    // Cancel the commit timer
    clearTimeout(mostRecent.timerId);

    // Notify consumer of undo
    onUndo?.(mostRecent.habitId, mostRecent.date, mostRecent.wasCompleted);

    // Remove from queue
    setPendingToggles((prev) => {
      const newQueue = prev.slice(0, -1);
      // Hide toast if queue is now empty
      if (newQueue.length === 0) {
        setToastVisible(false);
      }
      return newQueue;
    });

    return true;
  }, [onUndo]);

  /**
   * Undo all pending toggles in the queue
   */
  const undoAll = useCallback((): number => {
    const queue = pendingTogglesRef.current;
    if (queue.length === 0) {
      return 0;
    }

    const count = queue.length;

    // Cancel all timers and notify for each
    for (const toggle of queue) {
      clearTimeout(toggle.timerId);
      onUndo?.(toggle.habitId, toggle.date, toggle.wasCompleted);
    }

    // Clear the queue
    setPendingToggles([]);
    setToastVisible(false);

    return count;
  }, [onUndo]);

  /**
   * Dismiss the toast without undoing (timers continue for all queued toggles)
   */
  const dismissToast = useCallback(() => {
    setToastVisible(false);
    // Note: We don't clear the queue - all timers will still commit
  }, []);

  /**
   * Check if a specific habit+date has a pending toggle
   */
  const hasPendingToggle = useCallback(
    (habitId: string, date: string): boolean => {
      return pendingTogglesRef.current.some(
        (t) => t.habitId === habitId && t.date === date
      );
    },
    []
  );

  /**
   * Get the pending toggle for a specific habit+date
   */
  const getPendingToggle = useCallback(
    (habitId: string, date: string): PendingToggle | undefined => {
      return pendingTogglesRef.current.find(
        (t) => t.habitId === habitId && t.date === date
      );
    },
    []
  );

  /**
   * Force commit all pending toggles immediately
   */
  const forceCommit = useCallback(() => {
    const queue = pendingTogglesRef.current;
    if (queue.length === 0) {
      return;
    }

    // Clear all timers and commit each toggle
    for (const toggle of queue) {
      clearTimeout(toggle.timerId);
      onCommit?.(toggle.habitId, toggle.date, toggle.wasCompleted);
    }

    // Clear the queue
    setPendingToggles([]);
    setToastVisible(false);
  }, [onCommit]);

  // Get the most recent toggle for display
  const mostRecentToggle =
    pendingToggles.length > 0 ? pendingToggles.at(-1) : null;

  // Compute derived state
  const state: ToggleUndoState = {
    dateLabel: mostRecentToggle ? formatDateLabel(mostRecentToggle.date) : '',
    pendingToggle: mostRecentToggle,
    pendingToggles,
    queueLength: pendingToggles.length,
    toastVisible,
  };

  return {
    dismissToast,
    forceCommit,
    getPendingToggle,
    hasPendingToggle,
    scheduleToggle,
    state,
    undoAll,
    undoToggle,
  };
}

export default useToggleUndo;
