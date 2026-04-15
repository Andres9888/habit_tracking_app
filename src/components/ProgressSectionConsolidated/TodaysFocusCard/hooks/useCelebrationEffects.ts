/**
 * useCelebrationEffects Hook
 *
 * Handles celebration state animations and confetti effects.
 */

import { useEffect, useState, useCallback } from 'react';
import {
  withSpring,
  withSequence,
  SharedValue,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { springs } from '@/theme/animations';

import type { FocusState } from '../../TodaysFocusCardTypes';
import { CONFETTI_DURATION } from '../TodaysFocusCard.constants';

export interface UseCelebrationEffectsResult {
  showConfetti: boolean;
  handleCelebrationAcknowledge: () => void;
}

export function useCelebrationEffects(
  focusState: FocusState,
  reduceMotion: boolean,
  badgeScale: SharedValue<number>,
  currentStreak: number,
  onMilestoneCelebrated?: (milestone: number) => void,
): UseCelebrationEffectsResult {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (focusState === 'celebrating' && !reduceMotion) {
      triggerHaptic('heavy');
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

      badgeScale.value = withSequence(
        withSpring(1.4, springs.bouncy),
        withSpring(1, springs.standard)
      );

      return () => clearTimeout(timer);
    } else if (focusState === 'celebrating' && reduceMotion) {
      triggerHaptic('toggle');
      badgeScale.value = 1;
    }
  }, [focusState, reduceMotion, badgeScale]);

  const handleCelebrationAcknowledge = useCallback(() => {
    if (focusState === 'celebrating' && onMilestoneCelebrated) {
      triggerHaptic('tap');
      onMilestoneCelebrated(currentStreak);
    }
  }, [focusState, currentStreak, onMilestoneCelebrated]);

  return {
    handleCelebrationAcknowledge,
    showConfetti,
  };
}
