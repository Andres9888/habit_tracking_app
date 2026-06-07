/**
 * Modal Enter Animation
 * Handles enter animations for each modal variant
 */

import { withSpring, withTiming } from 'react-native-reanimated';
import { durations, enterEasing, springs } from '@/theme/animations';
import type { ModalVariant } from './Modal.types';
import type { AnimationValues } from './modalAnimationEffects.types';
import { FULL_SCREEN_ENTER_MS } from './Modal.constants';
import { fadeIn } from './modalAnimationHelpers';

const SHEET_ENTER = { duration: durations.sheet, easing: enterEasing };

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
        : withTiming(targetOpacity, fadeIn(durations.sheet));
      translateY.value = useReduced ? 0 : withTiming(0, SHEET_ENTER);
      break;
    }
    case 'fullScreen': {
      // Match native Modal animationType='slide' — no backdrop, timing-based
      backdropOpacityValue.value = 0;
      fullScreenProgress.value = useReduced
        ? 1
        : withTiming(1, fadeIn(FULL_SCREEN_ENTER_MS));
      fullScreenGestureY.value = 0;
      break;
    }
    case 'centerAlert': {
      backdropOpacityValue.value = useReduced
        ? targetOpacity
        : withTiming(targetOpacity, fadeIn(200));
      alertOpacity.value = useReduced ? 1 : withTiming(1, fadeIn(200));
      scale.value = useReduced ? 1 : withSpring(1, springs.bottomSheet);
      break;
    }
  }
}
