/**
 * useHighlightAnimation Hook
 * Handles glow + card bounce animation when a habit is just created.
 *
 * Both highlightGlow and cardScale use reanimated SharedValues.
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { withSequence, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { runHighlightGlow } from './highlightAnimations';

export function useHighlightAnimation(
  isJustCreated: boolean,
  reduceMotionPreference: boolean,
  cardScale: SharedValue<number>,
  highlightGlow: SharedValue<number>
) {
  useEffect(() => {
    if (!isJustCreated || reduceMotionPreference) {
      highlightGlow.value = 0;
      return;
    }
    highlightGlow.value = 0;
    cardScale.value = 0.95;
    const timeout = setTimeout(() => {
      // Glow and card bounce start concurrently
      runHighlightGlow(highlightGlow);
      cardScale.value = withSequence(
        withSpring(1.04, springs.celebration),
        withSpring(1, springs.pulse)
      );
    }, 200);
    return () => clearTimeout(timeout);
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);
}
