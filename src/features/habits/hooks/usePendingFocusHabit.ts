/**
 * The "focus this habit on home" request raised by the Habit Library's
 * post-add primary action.
 *
 * It lives here, above HabitsList, on purpose: HabitsList is unmounted while
 * the habit list is empty, so a request armed from an empty-list import would
 * have nowhere to land — and a give-up timer inside the list would never run.
 * Holding both here means the request survives the mount and always expires.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

/**
 * How long to wait for the habit to show up in `habits.list` before dropping
 * the request. Covers imports that failed, habits deleted mid-flight, and rows
 * past MAX_HABITS_RENDER_LIMIT that will never reach the list.
 */
export const FOCUS_GIVE_UP_MS = 4000;

export interface PendingFocusHabitState {
  focusReady: boolean;
  focusRequestAutoClose: boolean;
  pendingFocusHabitId: Id<'habits'> | null;
  clearPendingFocusHabit: () => void;
  commitPendingFocusHabit: (id: Id<'habits'>) => void;
  markPendingFocusReady: (id: Id<'habits'>) => void;
  preparePendingFocusHabit: (id: Id<'habits'>) => void;
}

interface FocusRequest {
  autoClose: boolean;
  id: Id<'habits'> | null;
  ready: boolean;
}

const IDLE_REQUEST: FocusRequest = { autoClose: false, id: null, ready: false };

/**
 * @param onGiveUp runs when the request expires unfulfilled — the library is
 * still open at that point (closing it is part of fulfilling the request), so
 * the caller uses this to close it anyway.
 */
export function usePendingFocusHabit(
  onGiveUp?: () => void
): PendingFocusHabitState {
  const onGiveUpRef = useRef(onGiveUp);
  onGiveUpRef.current = onGiveUp;
  const [request, setRequest] = useState<FocusRequest>(IDLE_REQUEST);
  const requestRef = useRef(request);
  requestRef.current = request;

  const preparePendingFocusHabit = useCallback((id: Id<'habits'>) => {
    setRequest({ autoClose: false, id, ready: false });
  }, []);
  const commitPendingFocusHabit = useCallback((id: Id<'habits'>) => {
    setRequest((current) => ({
      autoClose: true,
      id,
      ready: current.id === id && current.ready,
    }));
  }, []);
  const markPendingFocusReady = useCallback((id: Id<'habits'>) => {
    setRequest((current) =>
      current.id === id ? { ...current, ready: true } : current
    );
  }, []);
  const clearPendingFocusHabit = useCallback(() => {
    setRequest(IDLE_REQUEST);
  }, []);

  useEffect(() => {
    // Once hidden convergence succeeds, the prepared anchor belongs to the
    // visible toast. Keep it until the user commits or cancels; otherwise a
    // deliberate pause before tapping Go silently degrades back to a cold
    // remount.
    if (!request.id || request.ready) return;
    const timer = setTimeout(() => {
      setRequest(IDLE_REQUEST);
      if (requestRef.current.autoClose) onGiveUpRef.current?.();
    }, FOCUS_GIVE_UP_MS);
    return () => clearTimeout(timer);
    // `autoClose` is a dep so a commit near the prepare deadline restarts a
    // full window instead of inheriting the stale prepare timer.
  }, [request.autoClose, request.id, request.ready]);

  return {
    clearPendingFocusHabit,
    commitPendingFocusHabit,
    focusReady: request.ready,
    focusRequestAutoClose: request.autoClose,
    markPendingFocusReady,
    pendingFocusHabitId: request.id,
    preparePendingFocusHabit,
  };
}
