/**
 * useSuccessAnimations Hook
 *
 * Manages the animation values and sequences for the success modal
 */

import { Animated } from 'react-native';
import { useEffect, useRef, useCallback } from 'react';

import {
  createEntranceSequence,
  createExitSequence,
} from './animationSequences';

interface UseSuccessAnimationsProps {
  visible: boolean;
  onHapticFeedback: () => void;
}

export function useSuccessAnimations({
  visible,
  onHapticFeedback,
}: UseSuccessAnimationsProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.5)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;

  const animatedValues = {
    backdropOpacity,
    buttonOpacity,
    buttonTranslateY,
    cardOpacity,
    cardScale,
    iconScale,
    textOpacity,
  };

  useEffect(() => {
    if (visible) {
      onHapticFeedback();
      createEntranceSequence(animatedValues).start();
    }
  }, [visible, onHapticFeedback]);

  const runExitAnimation = useCallback(
    (onComplete: () => void) => {
      createExitSequence({ backdropOpacity, cardOpacity, cardScale }).start(
        onComplete
      );
    },
    [backdropOpacity, cardOpacity, cardScale]
  );

  return { animatedValues, runExitAnimation };
}
