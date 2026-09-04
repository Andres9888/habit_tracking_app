/**
 * The "focus this habit on home" request raised by the Habit Library's
 * post-add primary action, and by the add-habit form as it closes.
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

export interface FocusRekey {
  from: Id<'habits'>;
  to: Id<'habits'>;
}

export interface PendingFocusHabitState {
  focusReady: boolean;
  /** Last optimistic→server id swap; lets the list carry its ring across it. */
  focusRekey: FocusRekey | null;
  focusRequestAutoClose: boolean;
  /**
   * Stable for the lifetime of one request, even across a rekey. The list
   * remounts on this, not on the habit id, so a swap does not remount it.
   */
  focusRequestKey: string | null;
  pendingFocusHabitId: Id<'habits'> | null;
  clearPendingFocusHabit: () => void;
  commitPendingFocusHabit: (id: Id<'habits'>) => void;
  markPendingFocusReady: (id: Id<'habits'>) => void;
  preparePendingFocusHabit: (id: Id<'habits'>) => void;
  /**
   * The add-habit form's variant of prepare: commits itself the moment the
   * list has converged, so the new row is revealed and ringed with no tap.
   */
  prepareCreatedHabitFocus: (id: Id<'habits'>) => void;
  /** Optimistic create synced: point the request at the server habit id. */
  rekeyPendingFocusHabit: (from: Id<'habits'>, to: Id<'habits'>) => void;
}

interface FocusRequest {
  autoClose: boolean;
  /** Commit as soon as `ready` (no user tap involved). */
  autoCommit: boolean;
  id: Id<'habits'> | null;
  key: string | null;
  ready: boolean;
}

const IDLE_REQUEST: FocusRequest = {
  autoClose: false,
  autoCommit: false,
  id: null,
  key: null,
  ready: false,
};

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
  const [rekey, setRekey] = useState<FocusRekey | null>(null);
  const requestRef = useRef(request);
  requestRef.current = request;

  const preparePendingFocusHabit = useCallback((id: Id<'habits'>) => {
    setRequest({ autoClose: false, autoCommit: false, id, key: id, ready: false });
  }, []);
  const prepareCreatedHabitFocus = useCallback((id: Id<'habits'>) => {
    setRequest({ autoClose: false, autoCommit: true, id, key: id, ready: false });
  }, []);
  const commitPendingFocusHabit = useCallback((id: Id<'habits'>) => {
    setRequest((current) => {
      const sameTarget = current.id === id;
      return {
        autoClose: true,
        autoCommit: false,
        id,
        key: sameTarget && current.key ? current.key : id,
        ready: sameTarget && current.ready,
      };
    });
  }, []);
  const rekeyPendingFocusHabit = useCallback(
    (from: Id<'habits'>, to: Id<'habits'>) => {
      setRekey({ from, to });
      setRequest((current) =>
        current.id === from ? { ...current, id: to } : current
      );
    },
    []
  );
  const markPendingFocusReady = useCallback((id: Id<'habits'>) => {
    setRequest((current) =>
      current.id === id ? { ...current, ready: true } : current
    );
  }, []);
  const clearPendingFocusHabit = useCallback(() => {
    setRequest(IDLE_REQUEST);
  }, []);

  // The form's request has no toast to wait for: commit as soon as the row
  // is placed, which is exactly what the library's "Go to" tap would do.
  useEffect(() => {
    if (!request.autoCommit || !request.ready || request.autoClose) return;
    setRequest((current) =>
      current.autoCommit && current.ready && !current.autoClose
        ? { ...current, autoClose: true }
        : current
    );
  }, [request.autoClose, request.autoCommit, request.ready]);

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
    focusRekey: rekey,
    focusRequestAutoClose: request.autoClose,
    focusRequestKey: request.key,
    markPendingFocusReady,
    pendingFocusHabitId: request.id,
    prepareCreatedHabitFocus,
    preparePendingFocusHabit,
    rekeyPendingFocusHabit,
  };
}
