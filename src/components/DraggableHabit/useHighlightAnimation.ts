/**
 * useHighlightAnimation Hook
 * Handles glow + card bounce animation when a habit is just created.
 *
 * highlightGlow uses reanimated SharedValue; cardScale remains legacy
 * Animated.Value (shared with press handlers and record animations).
 */

import { useEffect } from 'react';
import { Animated } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { runHighlightGlow } from './highlightAnimations';

export function useHighlightAnimation(
  isJustCreated: boolean,
  reduceMotionPreference: boolean,
  cardScale: Animated.Value,
  highlightGlow: SharedValue<number>
) {
  useEffect(() => {
    if (!isJustCreated || reduceMotionPreference) {
      highlightGlow.value = 0;
      return;
    }
    highlightGlow.value = 0;
    cardScale.setValue(0.95);
    const timeout = setTimeout(() => {
      // Glow (reanimated) and card bounce (legacy) start concurrently
      runHighlightGlow(highlightGlow);
      Animated.sequence([
        Animated.spring(cardScale, {
          damping: 12,
          stiffness: 200,
          toValue: 1.04,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          damping: 15,
          stiffness: 250,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);
    return () => clearTimeout(timeout);
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);
}
