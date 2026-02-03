/**
 * Celebration Animation
 * Triggers completion celebration effects
 */

import {
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Springs } from '../../../constants/motion';

interface CelebrationOptions {
  cardScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotate: SharedValue<number>;
  rippleScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  setShowFloatingXP: (show: boolean) => void;
  setXPPosition: (position: { x: number; y: number }) => void;
  setShowConfetti: (show: boolean) => void;
}

export function createCelebrationTrigger(options: CelebrationOptions) {
  const {
    cardScale,
    checkmarkScale,
    checkmarkRotate,
    rippleScale,
    rippleOpacity,
    setShowFloatingXP,
    setXPPosition,
    setShowConfetti,
  } = options;

  return () => {
    'worklet';
    // Haptic feedback
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

    // Card bounce (enhanced pulse)
    cardScale.value = withSequence(
      withSpring(1.05, Springs.bouncy),
      withSpring(1, Springs.button)
    );

    // Checkmark animation
    checkmarkScale.value = withSequence(
      withSpring(1.2, Springs.bouncy),
      withSpring(1, Springs.button)
    );
    checkmarkRotate.value = withTiming(360, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Ripple effect
    rippleScale.value = 0;
    rippleOpacity.value = 0.3;
    rippleScale.value = withTiming(2, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    rippleOpacity.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Confetti burst
    runOnJS(setShowConfetti)(true);

    // Floating XP
    runOnJS(setShowFloatingXP)(true);
    runOnJS(() => {
      setXPPosition({ x: 150, y: 20 });
      setTimeout(() => setShowFloatingXP(false), 1000);
    })();
  };
}

export function createUncheckTrigger(
  checkmarkScale: SharedValue<number>,
  checkmarkRotate: SharedValue<number>
) {
  return () => {
    'worklet';
    checkmarkScale.value = withTiming(0, {
      duration: 200,
      easing: Easing.in(Easing.cubic),
    });
    checkmarkRotate.value = 0;
  };
}
