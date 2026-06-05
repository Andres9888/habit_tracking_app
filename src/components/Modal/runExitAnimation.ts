/**
 * Modal Exit Animation
 * Handles exit animations for each modal variant
 */

import { withSpring, withTiming } from 'react-native-reanimated';
import type { ModalVariant } from './Modal.types';
import {
  SCREEN_HEIGHT,
  EXIT_SPRING_CONFIG,
  BOTTOM_SHEET_SPRING_CONFIG,
} from './Modal.constants';
import type { AnimationValues } from './modalAnimationEffects.types';
import { fadeOut } from './modalAnimationHelpers';

export function runExitAnimation(
  variant: ModalVariant,
  useReduced: boolean,
  v: AnimationValues
) {
  const {
    translateY,
    fullScreenProgress,
    scale,
    alertOpacity,
    backdropOpacityValue,
  } = v;

  switch (variant) {
    case 'bottomSheet': {
      backdropOpacityValue.value = useReduced ? 0 : withTiming(0, fadeOut(200));
      translateY.value = useReduced
        ? SCREEN_HEIGHT
        : withSpring(SCREEN_HEIGHT, BOTTOM_SHEET_SPRING_CONFIG);
      break;
    }
    case 'fullScreen': {
      // Match native Modal animationType='slide' — no backdrop, timing-based
      backdropOpacityValue.value = 0;
      fullScreenProgress.value = useReduced ? 0 : withTiming(0, fadeOut(350));
      break;
    }
    case 'centerAlert': {
      backdropOpacityValue.value = useReduced ? 0 : withTiming(0, fadeOut(200));
      alertOpacity.value = useReduced ? 0 : withTiming(0, { duration: 150 });
      scale.value = useReduced ? 0.92 : withTiming(0.92, { duration: 150 });
      break;
    }
  }
}
