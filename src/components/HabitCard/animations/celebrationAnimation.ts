/**
 * Celebration Animation
 * Implements home-screen-redesign-spec.md check animation:
 * - 240ms total: scale 1→1.15 (120ms) then 1.15→1 (120ms)
 * - Light impact haptic feedback
 * - Uncheck: 200ms scale 1→0.92→1 with soft tap
 */

import { withSpring, withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';
import { springs } from '../../../theme/animations';

interface CelebrationOptions {
  cardScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotate: SharedValue<number>;
  rippleScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  reduceMotion: boolean;
  setShowFloatingXP: (show: boolean) => void;
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
      // Satisfying spring completion — overshoot then settle
      checkmarkScale.value = 0;
      checkmarkScale.value = withSpring(1, {
        ...springs.bouncy,
        stiffness: 260,
        damping: 12,
      });
      // Subtle celebratory rotation wiggle
      checkmarkRotate.value = -8;
      checkmarkRotate.value = withSpring(0, springs.button);

      // Expanding ripple with spring feel
      rippleScale.value = 0;
      rippleOpacity.value = 0.3;
      rippleScale.value = withSpring(2, {
        ...springs.gentle,
        stiffness: 120,
        damping: 18,
      });
      rippleOpacity.value = withTiming(0, { duration: 350 });
    }

    runOnJS(setShowConfetti)(!reduceMotion);
    runOnJS(setShowFloatingXP)(true);
    runOnJS(() => {
      setXPPosition({ x: 150, y: 20 });
      setTimeout(() => setShowFloatingXP(false), 1000);
    })();
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

    if (reduceMotion) {
      checkmarkScale.value = 1;
      checkmarkRotate.value = 0;
    } else {
      // Spring shrink-and-pop for uncheck
      checkmarkScale.value = withSpring(0, {
        ...springs.button,
        stiffness: 300,
        damping: 16,
      });
      checkmarkRotate.value = withSpring(8, springs.micro);
    }
  };
}
