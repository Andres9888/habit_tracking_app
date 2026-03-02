/**
 * useSuccessAnimations Hook
 *
 * Manages the animation shared values and sequences for the success modal
 * Uses react-native-reanimated (migrated from legacy Animated)
 */

import { useEffect, useCallback } from 'react';
import { useSharedValue, runOnJS } from 'react-native-reanimated';

import {
  runEntranceSequence,
  runExitSequence,
} from './animationSequences';

interface UseSuccessAnimationsProps {
  visible: boolean;
  onHapticFeedback: () => void;
}

export function useSuccessAnimations({
  visible,
  onHapticFeedback,
}: UseSuccessAnimationsProps) {
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.5);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

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
      runEntranceSequence(animatedValues);
    }
  }, [visible, onHapticFeedback]);

  const runExitAnimation = useCallback(
    (onComplete: () => void) => {
      runExitSequence(
        { backdropOpacity, cardOpacity, cardScale },
        () => {
          'worklet';
          runOnJS(onComplete)();
        }
      );
    },
    [backdropOpacity, cardOpacity, cardScale]
  );

  return { animatedValues, runExitAnimation };
}
