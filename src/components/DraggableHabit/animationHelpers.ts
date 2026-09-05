/**
 * @module animationHelpers
 *
 * Reanimated-based micro-animations for the strength emoji.
 * These are triggered by {@link useStrengthAnimation} when strength changes.
 *
 * - {@link runLevelUpAnimation} — dramatic shake + scale burst on level threshold crossing
 * - {@link runSubtlePulse} — gentle scale bump on any strength increase within same level
 */

import {
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

/**
 * Dramatic level-up celebration: fade+shrink → shake left/right → spring back enlarged.
 * Triggered when the strength emoji changes tier (e.g. 🌿→🌳).
 */
export function runLevelUpAnimation(
  opacity: { value: number },
  scale: { value: number },
  rotation: { value: number }
) {
  opacity.value = withTiming(0.3, {
    duration: durations.quick,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  scale.value = withTiming(0.6, {
    duration: durations.quick,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  rotation.value = withSequence(
    withTiming(-8, {
      duration: durations.tick,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(8, {
      duration: durations.tick,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(0, {
      duration: durations.tick,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  opacity.value = withDelay(
    durations.quick,
    withTiming(1, {
      duration: durations.standard,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  scale.value = withDelay(
    durations.quick,
    withSequence(
      withSpring(1.4, springs.celebration),
      withSpring(1, springs.celebration)
    )
  );
}

/** Gentle scale bump (1 → 1.08 → 1) for strength increases within the same level. */
export function runSubtlePulse(scale: { value: number }) {
  scale.value = withSequence(
    withTiming(1.08, {
      duration: durations.instant,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    }),
    withSpring(1, springs.standard)
  );
}
