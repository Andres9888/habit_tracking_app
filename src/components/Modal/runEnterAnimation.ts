/**
 * Modal Enter Animation
 * Handles enter animations for each modal variant
 */

import { withSpring, withTiming } from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import type { ModalVariant } from './Modal.types';
import {
  FULLSCREEN_ORGANIC_SPRING,
  BOTTOM_SHEET_SPRING_CONFIG,
} from './Modal.constants';
import type { AnimationValues } from './modalAnimationEffects.types';
import { fadeIn } from './modalAnimationHelpers';

export function runEnterAnimation(
  variant: ModalVariant,
  useReduced: boolean,
  targetOpacity: number,
  v: AnimationValues
) {
  const {
    translateY,
    fullScreenProgress,
    fullScreenGestureY,
    scale,
    alertOpacity,
    backdropOpacityValue,
  } = v;

  switch (variant) {
    case 'bottomSheet': {
      backdropOpacityValue.value = useReduced
        ? targetOpacity
        : withTiming(targetOpacity, fadeIn(200));
      translateY.value = useReduced
        ? 0
        : withSpring(0, BOTTOM_SHEET_SPRING_CONFIG);
      break;
    }
    case 'fullScreen': {
      backdropOpacityValue.value = useReduced
        ? targetOpacity
        : withTiming(targetOpacity, fadeIn(400));
      fullScreenProgress.value = useReduced
        ? 1
        : withSpring(1, FULLSCREEN_ORGANIC_SPRING);
      fullScreenGestureY.value = 0;
      break;
    }
    case 'centerAlert': {
      backdropOpacityValue.value = useReduced
        ? targetOpacity
        : withTiming(targetOpacity, fadeIn(200));
      alertOpacity.value = useReduced ? 1 : withTiming(1, fadeIn(200));
      scale.value = useReduced
        ? 1
        : withSpring(1, springs.bottomSheet);
      break;
    }
  }
}
