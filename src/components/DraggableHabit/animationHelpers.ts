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
import { springs } from '@/theme/animations';

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
    duration: 150,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  scale.value = withTiming(0.6, {
    duration: 150,
    easing: ReanimatedEasing.out(ReanimatedEasing.ease),
  });
  rotation.value = withSequence(
    withTiming(-8, {
      duration: 80,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(8, {
      duration: 80,
      easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
    }),
    withTiming(0, {
      duration: 60,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  opacity.value = withDelay(
    150,
    withTiming(1, {
      duration: 200,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    })
  );
  scale.value = withDelay(
    150,
    withSequence(
      withSpring(1.4, springs.bouncy),
      withSpring(1, springs.bouncy)
    )
  );
}

/** Gentle scale bump (1 → 1.08 → 1) for strength increases within the same level. */
export function runSubtlePulse(scale: { value: number }) {
  scale.value = withSequence(
    withTiming(1.08, {
      duration: 100,
      easing: ReanimatedEasing.out(ReanimatedEasing.ease),
    }),
    withSpring(1, springs.standard)
  );
}
