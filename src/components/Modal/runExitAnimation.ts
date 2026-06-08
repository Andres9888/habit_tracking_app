/**
 * Modal Exit Animation
 * Handles exit animations for each modal variant
 */

import { withTiming } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import type { ModalVariant } from './Modal.types';
import { FULL_SCREEN_ENTER_MS, SCREEN_HEIGHT } from './Modal.constants';
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
      backdropOpacityValue.value = useReduced
        ? 0
        : withTiming(0, fadeOut(durations.sheet));
      translateY.value = useReduced
        ? SCREEN_HEIGHT
        : withTiming(SCREEN_HEIGHT, fadeOut(durations.sheet));
      break;
    }
    case 'fullScreen': {
      // Match native Modal animationType='slide' — no backdrop, timing-based
      backdropOpacityValue.value = 0;
      fullScreenProgress.value = useReduced
        ? 0
        : withTiming(0, fadeOut(FULL_SCREEN_ENTER_MS));
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
