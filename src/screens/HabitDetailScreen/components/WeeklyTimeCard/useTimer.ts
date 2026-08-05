import { useCallback, useEffect, useState } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from '../../../../utils/storage/safeStorageCore';

const STORAGE_KEY = '@chainday_active_timer';

interface ActiveTimer {
  habitId: string;
  startedAt: number;
}

function isActiveTimer(value: unknown): value is ActiveTimer {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.habitId === 'string' && typeof v.startedAt === 'number';
}

interface TimerState {
  startedAt: number | null;
  otherHabitRunning: boolean;
}

export function useTimer(habitId: Id<'habits'>) {
  const [state, setState] = useState<TimerState>({ otherHabitRunning: false, startedAt: null });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    void safeGetItem<ActiveTimer | null>(STORAGE_KEY, isActiveTimer, null).then((stored) => {
      if (cancelled || !stored) return;
      if (stored.habitId === habitId) {
        setState({ otherHabitRunning: false, startedAt: stored.startedAt });
        setNow(Date.now());
      } else {
        setState({ otherHabitRunning: true, startedAt: null });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [habitId]);

  useEffect(() => {
    if (state.startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state.startedAt]);

  const start = useCallback(async () => {
    const t = Date.now();
    setNow(t);
    setState({ otherHabitRunning: false, startedAt: t });
    await safeSetItem(STORAGE_KEY, { habitId, startedAt: t });
  }, [habitId]);

  const stop = useCallback(async (): Promise<number> => {
    const startedAt = state.startedAt;
    if (startedAt === null) return 0;
    const elapsedMs = Date.now() - startedAt;
    setState({ otherHabitRunning: false, startedAt: null });
    await safeRemoveItem(STORAGE_KEY);
    if (elapsedMs < 1000) return 0;
    return Math.max(1, Math.round(elapsedMs / 60000));
  }, [state.startedAt]);

  const elapsedMs = state.startedAt === null ? 0 : Math.max(0, now - state.startedAt);
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const elapsedMin = Math.floor(elapsedSec / 60);

  return {
    elapsedMin,
    elapsedSec,
    otherHabitRunning: state.otherHabitRunning,
    running: state.startedAt !== null,
    start,
    stop,
  };
}
