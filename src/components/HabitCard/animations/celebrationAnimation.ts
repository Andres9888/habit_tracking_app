/**
 * Celebration Animation
 * Implements home-screen-redesign-spec.md check animation:
 * - 240ms total: scale 1→1.15 (120ms) then 1.15→1 (120ms)
 * - Light impact haptic feedback
 * - Uncheck: 200ms scale 1→0.92→1 with soft tap
 */

import { withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';

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
      // 240ms check animation: 1→1.15→1
      checkmarkScale.value = withTiming(1.15, { duration: 120 }, () => {
        'worklet';
        checkmarkScale.value = withTiming(1, { duration: 120 });
      });
      checkmarkRotate.value = 0;

      // Subtle ripple
      rippleScale.value = 0;
      rippleOpacity.value = 0.2;
      rippleScale.value = withTiming(1.5, { duration: 240 });
      rippleOpacity.value = withTiming(0, { duration: 240 });
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

    checkmarkScale.value = reduceMotion
      ? 1
      : withTiming(0.92, { duration: 100 }, () => {
          'worklet';
          checkmarkScale.value = withTiming(1, { duration: 100 });
        });

    checkmarkRotate.value = 0;
  };
}
