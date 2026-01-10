/**
 * Strength Indicator Animation Functions
 *
 * These utility functions create the animations for emoji transitions
 * during strength level changes.
 */

import {
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatableValue {
  value: number;
}

/**
 * Level-up animation: fade out, wobble, grow new emoji
 * 🌱→🌿→🌳 LEVEL-UP ANIMATION: Meaningful growth transition
 */
export function animateLevelUp(
  emojiOpacity: AnimatableValue,
  emojiScale: AnimatableValue,
  emojiRotation: AnimatableValue
): void {
  // Phase 1: Fade out + shrink old emoji (transformation begins)
  emojiOpacity.value = withTiming(0.3, {
    duration: 150,
    easing: Easing.out(Easing.ease),
  });
  emojiScale.value = withTiming(0.6, {
    duration: 150,
    easing: Easing.out(Easing.ease),
  });
  // Gentle wobble like a plant swaying
  emojiRotation.value = withSequence(
    withTiming(-8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
    withTiming(8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
    withTiming(0, { duration: 60, easing: Easing.out(Easing.ease) })
  );

  // Phase 2: Fade in + grow new emoji (emergence)
  emojiOpacity.value = withDelay(
    150,
    withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
  );
  emojiScale.value = withDelay(
    150,
    withSequence(
      // Grow with overshoot (blossoming)
      withSpring(1.4, { damping: 6, stiffness: 120 }),
      // Settle to final size (rooted)
      withSpring(1, { damping: 10, stiffness: 180 })
    )
  );
}

/**
 * Subtle pulse animation for regular strength updates
 */
export function animatePulse(emojiScale: AnimatableValue): void {
  emojiScale.value = withSequence(
    withTiming(1.08, { duration: 100, easing: Easing.out(Easing.ease) }),
    withSpring(1, { damping: 15, stiffness: 200 })
  );
}
