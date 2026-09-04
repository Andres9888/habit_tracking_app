/**
 * "Open this habit's detail screen once it exists" — raised by the regular
 * add-habit form as it closes. Creation is optimistic, so the request is
 * keyed by the client request id first and re-keyed to the server id when
 * the mutation syncs; the opener waits for that server habit to reach
 * habits.list. Expires on its own so an offline create cannot leave a stale
 * request that opens a screen minutes later.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export const CREATED_HABIT_DETAIL_GIVE_UP_MS = 15000;

interface DetailRequest {
  id: Id<'habits'>;
  /** Epoch ms before which the screen must not open (the form's exit). */
  notBefore: number;
}

export interface CreatedHabitDetailRequestState {
  createdHabitDetailRequest: DetailRequest | null;
  requestCreatedHabitDetail: (habitId: Id<'habits'>, notBefore: number) => void;
  rekeyCreatedHabitDetail: (fromId: Id<'habits'>, toId: Id<'habits'>) => void;
  clearCreatedHabitDetail: () => void;
}

export function useCreatedHabitDetailRequest(): CreatedHabitDetailRequestState {
  const [request, setRequest] = useState<DetailRequest | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCreatedHabitDetail = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setRequest(null);
  }, []);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const requestCreatedHabitDetail = useCallback(
    (habitId: Id<'habits'>, notBefore: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRequest({ id: habitId, notBefore });
      timerRef.current = setTimeout(
        clearCreatedHabitDetail,
        CREATED_HABIT_DETAIL_GIVE_UP_MS
      );
    },
    [clearCreatedHabitDetail]
  );

  const rekeyCreatedHabitDetail = useCallback(
    (fromId: Id<'habits'>, toId: Id<'habits'>) => {
      setRequest((current) =>
        current && current.id === fromId ? { ...current, id: toId } : current
      );
    },
    []
  );

  return {
    clearCreatedHabitDetail,
    createdHabitDetailRequest: request,
    rekeyCreatedHabitDetail,
    requestCreatedHabitDetail,
  };
}
