/**
 * Home-level feedback for a habit created through the regular add-habit
 * form. Mirrors the Habit Library's post-add toast: name the habit back,
 * offer "Go to <name>" (scroll + highlight on Today) and "Add another".
 *
 * Creation is optimistic, so the toast is keyed by the client request id
 * first and re-keyed to the server id once the mutation syncs. "Go to" then
 * targets whichever row currently represents the habit.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export interface CreatedHabitFeedback {
  color: string;
  habitId: Id<'habits'>;
  icon: string;
  name: string;
}

export interface CreatedHabitFeedbackState {
  createdHabitFeedback: CreatedHabitFeedback | null;
  /** Habits created this session; drives the toast's "That's N added" copy. */
  createdHabitCount: number;
  /** `delayMs` lets the create form finish its exit before the toast enters. */
  showCreatedHabitFeedback: (
    feedback: CreatedHabitFeedback,
    delayMs?: number
  ) => void;
  rekeyCreatedHabitFeedback: (
    fromId: Id<'habits'>,
    toId: Id<'habits'>
  ) => void;
  dismissCreatedHabitFeedback: () => void;
}

function rekey(
  feedback: CreatedHabitFeedback | null,
  fromId: Id<'habits'>,
  toId: Id<'habits'>
) {
  return feedback && feedback.habitId === fromId
    ? { ...feedback, habitId: toId }
    : feedback;
}

export function useCreatedHabitFeedback(): CreatedHabitFeedbackState {
  const [feedback, setFeedback] = useState<CreatedHabitFeedback | null>(null);
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Feedback waiting on its delay. Kept in a ref so a sync that lands during
  // the delay still re-keys what will eventually be shown.
  const pendingRef = useRef<CreatedHabitFeedback | null>(null);

  const clearPending = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  const showCreatedHabitFeedback = useCallback(
    (next: CreatedHabitFeedback, delayMs = 0) => {
      clearPending();
      setCount((current) => current + 1);
      if (delayMs <= 0) {
        setFeedback(next);
        return;
      }
      // Hide first so a back-to-back create replays the entrance instead of
      // swapping copy inside a toast that is already up.
      setFeedback(null);
      pendingRef.current = next;
      timerRef.current = setTimeout(() => {
        const pending = pendingRef.current;
        clearPending();
        setFeedback(pending);
      }, delayMs);
    },
    [clearPending]
  );

  const rekeyCreatedHabitFeedback = useCallback(
    (fromId: Id<'habits'>, toId: Id<'habits'>) => {
      pendingRef.current = rekey(pendingRef.current, fromId, toId);
      setFeedback((current) => rekey(current, fromId, toId));
    },
    []
  );

  const dismissCreatedHabitFeedback = useCallback(() => {
    clearPending();
    setFeedback(null);
  }, [clearPending]);

  return {
    createdHabitCount: count,
    createdHabitFeedback: feedback,
    dismissCreatedHabitFeedback,
    rekeyCreatedHabitFeedback,
    showCreatedHabitFeedback,
  };
}
