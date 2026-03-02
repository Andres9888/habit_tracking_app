/**
 * usePerfectDayConfetti — triggers a one-time confetti burst when all habits are done.
 *
 * Sits at the screen level (HabitsApp) so the ConfettiSystem can cover the full
 * viewport. Haptics are disabled here because useCelebrationState in BottomActionBar
 * already fires them — this hook only manages the visual confetti.
 */

import { useEffect, useRef } from 'react';
import { useCelebration } from '../../../components/CelebrationSystem';
import type { BurstType } from '../../../components/CelebrationSystem';

const BURST_TYPE: BurstType = 'chainCompletion';
const AUTO_CLEAR_MS = 3000;

export function usePerfectDayConfetti(
  completedToday: number,
  totalHabits: number,
  reduceMotion: boolean,
) {
  const { activeBurst, celebrationKey, triggerCelebration, triggerAutoClear } =
    useCelebration({
      shouldReduceMotion: reduceMotion,
      hapticsEnabled: false,
      soundEnabled: false,
    });

  const wasAllDone = useRef(false);

  useEffect(() => {
    const isAllDone = completedToday >= totalHabits && totalHabits > 0;

    if (isAllDone && !wasAllDone.current) {
      triggerCelebration(BURST_TYPE);
      triggerAutoClear(AUTO_CLEAR_MS);
    }

    wasAllDone.current = isAllDone;
  }, [completedToday, totalHabits, triggerCelebration, triggerAutoClear]);

  return { activeBurst, celebrationKey };
}
