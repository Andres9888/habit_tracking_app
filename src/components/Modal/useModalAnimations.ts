/**
 * useModalAnimations Hook
 * Manages animation values for Modal variants
 */

import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { ModalVariant } from './Modal.types';
import { SCREEN_HEIGHT } from './Modal.constants';
import { runEnterAnimation, runExitAnimation } from './modalAnimationEffects';

interface UseModalAnimationsParams {
  visible: boolean;
  variant: ModalVariant;
  backdropOpacity: number;
  reduceMotion: boolean;
  respectReduceMotion: boolean;
}

export function useModalAnimations({
  visible,
  variant,
  backdropOpacity,
  reduceMotion,
  respectReduceMotion,
}: UseModalAnimationsParams) {
  // Bottom sheet animation value
  const translateY = useSharedValue(SCREEN_HEIGHT);

  // Full screen animation values (Apple-like)
  const fullScreenProgress = useSharedValue(0);
  const fullScreenGestureY = useSharedValue(0);

  // Center alert animation values
  const scale = useSharedValue(0.92);
  const alertOpacity = useSharedValue(0);

  // Backdrop opacity
  const backdropOpacityValue = useSharedValue(0);

  // Collect all values for animation functions
  const animationValues = {
    alertOpacity,
    backdropOpacityValue,
    fullScreenGestureY,
    fullScreenProgress,
    scale,
    translateY,
  };

  // Enter/Exit animations
  useEffect(() => {
    const useReducedAnimation = reduceMotion && respectReduceMotion;

    if (visible) {
      runEnterAnimation(
        variant,
        useReducedAnimation,
        backdropOpacity,
        animationValues
      );
    } else {
      runExitAnimation(variant, useReducedAnimation, animationValues);
    }
  }, [visible, variant, reduceMotion, respectReduceMotion]);

  return animationValues;
}
