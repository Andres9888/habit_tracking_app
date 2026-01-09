/**
 * Modal Animation Effects - Enter/exit animations for each modal variant
 */

import {
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { ModalVariant } from './Modal.types';
import {
  SCREEN_HEIGHT,
  FULLSCREEN_ORGANIC_SPRING,
  EXIT_SPRING_CONFIG,
  BOTTOM_SHEET_SPRING_CONFIG,
} from './Modal.constants';

interface AnimationValues {
  translateY: SharedValue<number>;
  fullScreenProgress: SharedValue<number>;
  fullScreenGestureY: SharedValue<number>;
  scale: SharedValue<number>;
  alertOpacity: SharedValue<number>;
  backdropOpacityValue: SharedValue<number>;
}

const fadeIn = (duration: number) => ({
  duration,
  easing: Easing.out(Easing.cubic),
});
const fadeOut = (duration: number) => ({
  duration,
  easing: Easing.in(Easing.cubic),
});
const hapticCallback = (finished?: boolean) => {
  if (finished) runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
};

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
        : withSpring(0, BOTTOM_SHEET_SPRING_CONFIG, hapticCallback);
      break;
    }
    case 'fullScreen': {
      backdropOpacityValue.value = useReduced
        ? targetOpacity
        : withTiming(targetOpacity, fadeIn(400));
      fullScreenProgress.value = useReduced
        ? 1
        : withSpring(1, FULLSCREEN_ORGANIC_SPRING, hapticCallback);
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
        : withSpring(1, { damping: 20, stiffness: 300 });
      break;
    }
  }
}

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
      backdropOpacityValue.value = useReduced ? 0 : withTiming(0, fadeOut(300));
      fullScreenProgress.value = useReduced
        ? 0
        : withSpring(0, EXIT_SPRING_CONFIG);
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
