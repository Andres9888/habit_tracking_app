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
 * This hook should be used at a screen/context level to manage
 * toggle undo state across multiple components.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
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
  /** The current pending toggle (most recent) */
  pendingToggle: PendingToggle | null;
  /** Whether the toast should be visible */
  toastVisible: boolean;
  /** Formatted date label for display (e.g., "Dec 28") */
  dateLabel: string;
}

export interface UseToggleUndoOptions {
  /** Duration of the undo window in ms (default: 3000) */
  undoWindowMs?: number;
  /** Callback when a toggle is committed (timer expired without undo) */
  onCommit?: (habitId: string, date: string, wasCompleted: boolean) => void | Promise<void>;
  /** Callback when a toggle is undone */
  onUndo?: (habitId: string, date: string, wasCompleted: boolean) => void;
}

export interface UseToggleUndoReturn {
  /** Current state of the undo system */
  state: ToggleUndoState;
  /**
   * Schedule a toggle with undo capability.
   * Returns true if the toggle was scheduled, false if there's already a pending toggle.
   */
  scheduleToggle: (
    habitId: string,
    habitName: string,
    date: string,
    wasCompleted: boolean
  ) => boolean;
  /**
   * Undo the current pending toggle.
   * Returns true if an undo was performed, false if there was nothing to undo.
   */
  undoToggle: () => boolean;
  /**
   * Dismiss the toast without undoing (commits the toggle).
   */
  dismissToast: () => void;
  /**
   * Check if a specific habit+date has a pending toggle.
   */
  hasPendingToggle: (habitId: string, date: string) => boolean;
  /**
   * Force commit any pending toggle immediately.
   */
  forceCommit: () => void;
}

const DEFAULT_UNDO_WINDOW_MS = 3000;

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
  return `toggle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useToggleUndo(options: UseToggleUndoOptions = {}): UseToggleUndoReturn {
  const {
    undoWindowMs = DEFAULT_UNDO_WINDOW_MS,
    onCommit,
    onUndo,
  } = options;

  const [pendingToggle, setPendingToggle] = useState<PendingToggle | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Use ref to track latest pending toggle for cleanup
  const pendingToggleRef = useRef<PendingToggle | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    pendingToggleRef.current = pendingToggle;
  }, [pendingToggle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingToggleRef.current) {
        clearTimeout(pendingToggleRef.current.timerId);
      }
    };
  }, []);

  /**
   * Commit the pending toggle to the backend
   */
  const commitToggle = useCallback(async (toggle: PendingToggle) => {
    try {
      await onCommit?.(toggle.habitId, toggle.date, toggle.wasCompleted);
    } catch (error) {
      console.error('Failed to commit toggle:', error);
    } finally {
      // Clear state after commit
      setPendingToggle(null);
      setToastVisible(false);
    }
  }, [onCommit]);

  /**
   * Schedule a toggle with undo capability
   */
  const scheduleToggle = useCallback((
    habitId: string,
    habitName: string,
    date: string,
    wasCompleted: boolean
  ): boolean => {
    // If there's already a pending toggle, commit it first
    if (pendingToggleRef.current) {
      clearTimeout(pendingToggleRef.current.timerId);
      // Commit the previous toggle synchronously (fire and forget)
      const prevToggle = pendingToggleRef.current;
      onCommit?.(prevToggle.habitId, prevToggle.date, prevToggle.wasCompleted);
    }

    // Create new pending toggle
    const timerId = setTimeout(() => {
      const current = pendingToggleRef.current;
      if (current) {
        commitToggle(current);
      }
    }, undoWindowMs);

    const newToggle: PendingToggle = {
      id: generateToggleId(),
      habitId,
      habitName,
      date,
      wasCompleted,
      timestamp: Date.now(),
      timerId,
    };

    setPendingToggle(newToggle);
    setToastVisible(true);

    return true;
  }, [undoWindowMs, onCommit, commitToggle]);

  /**
   * Undo the current pending toggle
   */
  const undoToggle = useCallback((): boolean => {
    const current = pendingToggleRef.current;
    if (!current) {
      return false;
    }

    // Cancel the commit timer
    clearTimeout(current.timerId);

    // Notify consumer of undo
    onUndo?.(current.habitId, current.date, current.wasCompleted);

    // Clear state
    setPendingToggle(null);
    setToastVisible(false);

    return true;
  }, [onUndo]);

  /**
   * Dismiss the toast without undoing (timer continues/commits)
   */
  const dismissToast = useCallback(() => {
    setToastVisible(false);
    // Note: We don't clear pendingToggle - the timer will still commit
  }, []);

  /**
   * Check if a specific habit+date has a pending toggle
   */
  const hasPendingToggle = useCallback((habitId: string, date: string): boolean => {
    const current = pendingToggleRef.current;
    return current?.habitId === habitId && current?.date === date;
  }, []);

  /**
   * Force commit any pending toggle immediately
   */
  const forceCommit = useCallback(() => {
    const current = pendingToggleRef.current;
    if (current) {
      clearTimeout(current.timerId);
      commitToggle(current);
    }
  }, [commitToggle]);

  // Compute derived state
  const state: ToggleUndoState = {
    pendingToggle,
    toastVisible,
    dateLabel: pendingToggle ? formatDateLabel(pendingToggle.date) : '',
  };

  return {
    state,
    scheduleToggle,
    undoToggle,
    dismissToast,
    hasPendingToggle,
    forceCommit,
  };
}

export default useToggleUndo;
