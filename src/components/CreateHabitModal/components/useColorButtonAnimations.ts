/**
 * Animation hooks for AnimatedColorButton.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import {
  durations,
  enterEasing,
  exitEasing,
  springs,
} from '@/theme/animations';

export function useColorButtonAnimations(isSelected: boolean) {
  const scale = useSharedValue(1);
  const wasSelected = useRef(isSelected);

  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      scale.value = withSequence(
        withTiming(1.15, {
          duration: durations.instant,
          easing: enterEasing,
        }),
        withSpring(1, springs.standard)
      );
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.9, {
      duration: durations.instant,
      easing: exitEasing,
    });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, {
      duration: durations.quick,
      easing: enterEasing,
    });
  }, [scale]);

  return { handlePressIn, handlePressOut, scale };
}
