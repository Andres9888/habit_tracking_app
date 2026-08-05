/**
 * useCelebrationState — detects the all-done transition and fires haptics.
 *
 * Returns `isAllDone` (steady state) and `justCompleted` (true for 2s after
 * the transition, used to trigger one-shot celebration animations).
 */

import { useEffect, useRef, useState } from 'react';
import { HapticPatterns } from '../../../../utils/haptics';

interface CelebrationState {
  isAllDone: boolean;
  justCompleted: boolean;
}

export function useCelebrationState(
  completedToday: number,
  totalHabits: number,
  reduceMotion: boolean
): CelebrationState {
  const isAllDone = completedToday >= totalHabits && totalHabits > 0;
  const wasAllDone = useRef(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (isAllDone && !wasAllDone.current) {
      setJustCompleted(true);
      if (!reduceMotion) void HapticPatterns.celebration();
      const timer = setTimeout(() => setJustCompleted(false), 2000);
      wasAllDone.current = true;
      return () => clearTimeout(timer);
    }
    if (!isAllDone) {
      wasAllDone.current = false;
      setJustCompleted(false);
    }
    return;
  }, [isAllDone, reduceMotion]);

  return { isAllDone, justCompleted };
}
