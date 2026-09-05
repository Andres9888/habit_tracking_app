/**
 * Animation Sequences
 *
 * Pre-built animation sequences for the success modal
 * Uses react-native-reanimated (migrated from legacy Animated)
 */

import type { SharedValue } from 'react-native-reanimated';
import {
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';

import { ANIMATION_DURATIONS } from './constants';

export interface AnimatedValues {
  backdropOpacity: SharedValue<number>;
  buttonOpacity: SharedValue<number>;
  buttonTranslateY: SharedValue<number>;
  cardOpacity: SharedValue<number>;
  cardScale: SharedValue<number>;
  iconScale: SharedValue<number>;
  textOpacity: SharedValue<number>;
}

export function runEntranceSequence(values: AnimatedValues) {
  const {
    backdropOpacity,
    cardScale,
    cardOpacity,
    iconScale,
    textOpacity,
    buttonOpacity,
    buttonTranslateY,
  } = values;

  // Step 1: Backdrop fades in
  const step1Duration = ANIMATION_DURATIONS.backdropFadeIn;
  backdropOpacity.value = withTiming(1, { duration: step1Duration });

  // Step 2: Card bounces in (after backdrop)
  const step2Delay = step1Duration;
  cardScale.value = withDelay(
    step2Delay,
    withSpring(1, { ...springs.celebration, mass: 1 })
  );
  cardOpacity.value = withDelay(
    step2Delay,
    withTiming(1, { duration: ANIMATION_DURATIONS.cardBounce })
  );

  // Step 3: Icon springs in (after card — estimate spring ~300ms)
  const step3Delay = step2Delay + 300;
  iconScale.value = withDelay(
    step3Delay,
    withSpring(1, springs.pop)
  );

  // Step 4: Text fades in (after icon — estimate spring ~250ms)
  const step4Delay = step3Delay + 250;
  textOpacity.value = withDelay(
    step4Delay,
    withTiming(1, { duration: ANIMATION_DURATIONS.textFadeIn })
  );

  // Step 5: Button slides up (after text fade)
  const step5Delay = step4Delay + ANIMATION_DURATIONS.textFadeIn;
  buttonOpacity.value = withDelay(
    step5Delay,
    withTiming(1, { duration: ANIMATION_DURATIONS.buttonSlideUp })
  );
  buttonTranslateY.value = withDelay(
    step5Delay,
    withSpring(0, { ...springs.standard, mass: 1 })
  );
}

export function runExitSequence(
  values: Pick<AnimatedValues, 'backdropOpacity' | 'cardOpacity' | 'cardScale'>,
  onComplete?: () => void
) {
  const { backdropOpacity, cardOpacity, cardScale } = values;
  const duration = ANIMATION_DURATIONS.exitAnimation;

  cardScale.value = withTiming(0.9, { duration });
  cardOpacity.value = withTiming(0, { duration });
  backdropOpacity.value = withTiming(0, { duration }, (finished) => {
    if (finished && onComplete) {
      onComplete();
    }
  });
}
