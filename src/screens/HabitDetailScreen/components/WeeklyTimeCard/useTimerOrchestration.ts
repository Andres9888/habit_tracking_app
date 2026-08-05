import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useTimer } from './useTimer';

interface UseTimerOrchestrationArgs {
  habitId: Id<'habits'>;
  todayKey: string;
  todayPersistedMinutes: number;
}

export function useTimerOrchestration({
  habitId,
  todayKey,
  todayPersistedMinutes,
}: UseTimerOrchestrationArgs) {
  const { elapsedMin, elapsedSec, running, start, stop } = useTimer(habitId);
  const setMinutes = useMutation(api.tracking.setHabitMinutes);
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(null);

  const handleStart = useCallback(() => {
    void start();
  }, [start]);

  const handleStop = useCallback(async () => {
    const elapsed = await stop();
    if (elapsed === 0) return;
    setPendingMinutes(elapsed);
  }, [stop]);

  const handleDiscard = useCallback(() => {
    setPendingMinutes(null);
  }, []);

  const handleLog = useCallback(async () => {
    if (pendingMinutes === null) return;
    try {
      await setMinutes({
        date: todayKey,
        habitId,
        minutes: todayPersistedMinutes + pendingMinutes,
      });
      setPendingMinutes(null);
    } catch (error_: unknown) {
      console.error('[useTimerOrchestration] Failed to log timer session', {
        date: todayKey,
        elapsedMinutes: pendingMinutes,
        error: error_,
        habitId,
        priorMinutes: todayPersistedMinutes,
      });
    }
  }, [pendingMinutes, setMinutes, todayKey, habitId, todayPersistedMinutes]);

  return {
    elapsedMin,
    elapsedSec,
    handleDiscard,
    handleLog,
    handleStart,
    handleStop,
    pendingMinutes,
    running,
  };
}
