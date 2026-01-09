/**
 * useHighlightAnimation Hook
 * Handles glow animation when a habit is just created
 */

import { useEffect } from 'react';
import { Animated } from 'react-native';
import { runHighlightAnimation } from './animationSequences';

export function useHighlightAnimation(
  isJustCreated: boolean,
  reduceMotionPreference: boolean,
  cardScale: Animated.Value,
  highlightGlow: Animated.Value
) {
  useEffect(() => {
    if (!isJustCreated || reduceMotionPreference) {
      highlightGlow.setValue(0);
      return;
    }
    highlightGlow.setValue(0);
    cardScale.setValue(0.95);
    const timeout = setTimeout(
      () => runHighlightAnimation(cardScale, highlightGlow),
      200
    );
    return () => clearTimeout(timeout);
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);
}
