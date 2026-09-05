/**
 * Fade Up Animation Variant
 * Simple fade + translate up animation (baseline)
 */

import { withTiming, Easing } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { EntranceAnimationValues } from '../types';
import { TIMING, ACCENT_TARGET_WIDTH } from '../constants';

export function runFadeUp(
  values: EntranceAnimationValues,
  onAnimationComplete?: () => void
) {
  'worklet';
  const duration = TIMING.fadeUp;

  values.cardOpacity.value = withTiming(1, {
    duration,
    easing: Easing.out(Easing.cubic),
  });
  values.cardTranslateY.value = withTiming(0, {
    duration,
    easing: Easing.out(Easing.cubic),
  });

  values.accentScaleY.value = 1;
  values.accentWidth.value = ACCENT_TARGET_WIDTH;
  values.accentOpacity.value = withTiming(1, {
    duration,
    easing: Easing.out(Easing.cubic),
  });

  values.contentOpacity.value = withTiming(1, {
    duration,
    easing: Easing.out(Easing.cubic),
  });
  values.contentTranslateX.value = 0;

  values.cardOpacity.value = withTiming(1, { duration }, (finished) => {
    if (finished) {
      values.isAnimating.value = false;
      if (onAnimationComplete) {
        scheduleOnRN(onAnimationComplete);
      }
    }
  });
}
