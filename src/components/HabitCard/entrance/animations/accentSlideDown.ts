/**
 * Accent Slide Down Animation Variant (RECOMMENDED)
 * Accent bar slides down from top, then content fades in
 */

import {
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { EntranceAnimationValues } from '../types';
import {
  TIMING,
  ACCENT_TARGET_WIDTH,
  ACCENT_SPRING_CONFIG,
} from '../constants';

export function runAccentSlideDown(
  values: EntranceAnimationValues,
  onAnimationComplete?: () => void
) {
  'worklet';

  // Phase 1: Card container fades in
  values.cardOpacity.value = withTiming(1, {
    duration: TIMING.cardFadeIn,
    easing: Easing.out(Easing.cubic),
  });
  values.cardTranslateY.value = 0;

  values.accentOpacity.value = withTiming(1, {
    duration: TIMING.cardFadeIn,
    easing: Easing.out(Easing.cubic),
  });
  values.accentWidth.value = ACCENT_TARGET_WIDTH;

  // Phase 2: Accent bar slides down
  values.accentScaleY.value = withDelay(
    TIMING.cardFadeIn,
    withSpring(1, ACCENT_SPRING_CONFIG)
  );

  // Phase 3: Content fades in from left
  const contentDelay = TIMING.cardFadeIn + TIMING.accentSlide * 0.5;
  values.contentOpacity.value = withDelay(
    contentDelay,
    withTiming(1, {
      duration: TIMING.contentFadeIn,
      easing: Easing.out(Easing.cubic),
    })
  );
  values.contentTranslateX.value = withDelay(
    contentDelay,
    withTiming(0, {
      duration: TIMING.contentFadeIn,
      easing: Easing.out(Easing.cubic),
    })
  );

  // Mark animation complete
  values.contentOpacity.value = withDelay(
    contentDelay,
    withTiming(1, { duration: TIMING.contentFadeIn }, (finished) => {
      if (finished) {
        values.isAnimating.value = false;
        if (onAnimationComplete) {
          scheduleOnRN(onAnimationComplete);
        }
      }
    })
  );
}
