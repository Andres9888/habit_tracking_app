/**
 * Celebration Animation
 * Implements home-screen-redesign-spec.md check animation:
 * - 240ms total: scale 1→1.15 (120ms) then 1.15→1 (120ms)
 * - Light impact haptic feedback
 * - Uncheck: 200ms scale 1→0.92→1 with soft tap
 */

import { withSpring, withSequence, withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

/** Design-system spring: damping 18, stiffness 150 */
const COMPLETION_SPRING = springs.standard;
/** Slightly bouncier for the overshoot pop */
const BOUNCE_SPRING = springs.celebration;

interface CelebrationOptions {
  cardScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotate: SharedValue<number>;
  rippleScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  reduceMotion: boolean;
  setShowFloatingXP: (show: boolean) => void;
  scheduleFloatingXPHide: () => void;
  setXPPosition: (position: { x: number; y: number }) => void;
  setShowConfetti: (show: boolean) => void;
}

export function createCelebrationTrigger(options: CelebrationOptions) {
  const {
    checkmarkScale,
    checkmarkRotate,
    rippleScale,
    rippleOpacity,
    reduceMotion,
  setShowFloatingXP,
  scheduleFloatingXPHide,
  setXPPosition,
  setShowConfetti,
} = options;

  return () => {
    'worklet';
    // Haptic feedback is handled by tapGesture onBegin

    if (reduceMotion) {
      // Instant state change — no spring/timing animations
      checkmarkScale.value = 1;
      checkmarkRotate.value = 0;
      rippleScale.value = 0;
      rippleOpacity.value = 0;
    } else {
      // Spring-based check animation: 0→1.2 (bounce) → 1 (settle)
      // Uses spring physics for a premium, organic feel
      checkmarkScale.value = withSequence(
        withSpring(1.2, BOUNCE_SPRING),
        withSpring(1, COMPLETION_SPRING)
      );
      // Subtle rotation morph during pop-in
      checkmarkRotate.value = withSequence(
        withSpring(-8, BOUNCE_SPRING),
        withSpring(0, COMPLETION_SPRING)
      );

      // Ripple with spring for softer falloff
      rippleScale.value = 0;
      rippleOpacity.value = 0.25;
      rippleScale.value = withSpring(1.8, COMPLETION_SPRING);
      rippleOpacity.value = withTiming(0, { duration: 300 });
    }

    runOnJS(setShowConfetti)(!reduceMotion);
    runOnJS(setShowFloatingXP)(true);
    runOnJS(() => {
      setXPPosition({ x: 150, y: 20 });
    })();
    runOnJS(scheduleFloatingXPHide)();
  };
}

export function createUncheckTrigger(
  checkmarkScale: SharedValue<number>,
  checkmarkRotate: SharedValue<number>,
  reduceMotion = false
) {
  return () => {
    'worklet';
    // Haptic feedback is handled by tapGesture onBegin

    checkmarkScale.value = reduceMotion
      ? 1
      : withTiming(0.92, { duration: 100 }, () => {
          'worklet';
          checkmarkScale.value = withTiming(1, { duration: 100 });
        });

    checkmarkRotate.value = 0;
  };
}
