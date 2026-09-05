/**
 * Width Expansion Animation Variant
 * Card fades up, accent bar width grows from 0 to target
 */

import {
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import type { EntranceAnimationValues } from '../types';
import { TIMING, ACCENT_TARGET_WIDTH } from '../constants';

export function runWidthExpansion(
  values: EntranceAnimationValues,
  onAnimationComplete?: () => void
) {
  'worklet';

  // Phase 1: Card fades up with subtle slide
  values.cardOpacity.value = withTiming(1, {
    duration: TIMING.fadeUp,
    easing: Easing.out(Easing.cubic),
  });
  values.cardTranslateY.value = withSpring(0, springs.sheet);

  values.accentScaleY.value = 1;
  values.accentOpacity.value = 1;

  // Content fades in slightly delayed
  values.contentOpacity.value = withDelay(
    TIMING.widthExpansionDelay,
    withTiming(1, {
      duration: TIMING.fadeUp,
      easing: Easing.out(Easing.cubic),
    })
  );
  values.contentTranslateX.value = 0;

  // Phase 2: Accent bar width expands with spring bounce
  values.accentWidth.value = withDelay(
    TIMING.widthExpansionDelay,
    withSpring(
      ACCENT_TARGET_WIDTH,
      {
        ...springs.celebration,
        mass: 0.8,
      },
      (finished) => {
        if (finished) {
          values.isAnimating.value = false;
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      }
    )
  );
}
