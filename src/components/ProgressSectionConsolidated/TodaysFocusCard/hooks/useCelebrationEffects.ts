/**
 * useCelebrationEffects Hook
 *
 * Handles celebration state animations and confetti effects.
 */

import { useEffect, useState, useCallback } from 'react';
import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  SharedValue,
} from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { durations, springs } from '@/theme/animations';

import type { FocusState } from '../../TodaysFocusCardTypes';
import { CONFETTI_DURATION } from '../TodaysFocusCard.constants';

export interface UseCelebrationEffectsResult {
  showConfetti: boolean;
  handleCelebrationAcknowledge: () => void;
  handleSharePress: () => void;
}

export function useCelebrationEffects(
  focusState: FocusState,
  reduceMotion: boolean,
  badgeScale: SharedValue<number>,
  shareButtonOpacity: SharedValue<number>,
  currentStreak: number,
  onMilestoneCelebrated?: (milestone: number) => void,
  onShare?: () => void
): UseCelebrationEffectsResult {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (focusState === 'celebrating' && !reduceMotion) {
      triggerHaptic('heavy');
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);

      badgeScale.value = withSequence(
        withSpring(1.4, springs.celebration),
        withSpring(1, springs.standard)
      );
      shareButtonOpacity.value = withDelay(
        durations.emphasis,
        withTiming(1, { duration: durations.moderate })
      );

      return () => clearTimeout(timer);
    } else if (focusState === 'celebrating' && reduceMotion) {
      triggerHaptic('toggle');
      badgeScale.value = 1;
      shareButtonOpacity.value = 1;
    }
  }, [focusState, reduceMotion, badgeScale, shareButtonOpacity]);

  const handleCelebrationAcknowledge = useCallback(() => {
    if (focusState === 'celebrating' && onMilestoneCelebrated) {
      triggerHaptic('tap');
      onMilestoneCelebrated(currentStreak);
    }
  }, [focusState, currentStreak, onMilestoneCelebrated]);

  const handleSharePress = useCallback(() => {
    if (onShare) {
      triggerHaptic('toggle');
      onShare();
    }
  }, [onShare]);

  return {
    handleCelebrationAcknowledge,
    handleSharePress,
    showConfetti,
  };
}
