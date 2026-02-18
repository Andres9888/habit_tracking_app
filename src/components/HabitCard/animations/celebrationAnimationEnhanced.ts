/**
 * Enhanced Celebration Animation
 *
 * Integrates the new confetti system with the existing habit card animations.
 * Maintains backward compatibility while adding support for multiple burst types.
 */

import { withSpring, withSequence, withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';

import type { BurstType } from '../../CelebrationSystem/confetti/types';

/** Design-system spring: damping 18, stiffness 150 */
const COMPLETION_SPRING = { damping: 18, stiffness: 150 };
/** Slightly bouncier for the overshoot pop */
const BOUNCE_SPRING = { damping: 12, stiffness: 200 };

interface EnhancedCelebrationOptions {
  cardScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotate: SharedValue<number>;
  rippleScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  reduceMotion: boolean;
  setShowFloatingXP: (show: boolean) => void;
  setXPPosition: (position: { x: number; y: number }) => void;
  setShowConfetti: (show: boolean) => void;
  timeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;

  /** New: Burst type for celebration */
  burstType?: BurstType;

  /** New: Callback to trigger enhanced celebration system */
  triggerEnhancedCelebration?: (burstType: BurstType) => void;
}

/**
 * Create an enhanced celebration trigger that supports multiple burst types
 */
export function createEnhancedCelebrationTrigger(options: EnhancedCelebrationOptions) {
  const {
    checkmarkScale,
    checkmarkRotate,
    rippleScale,
    rippleOpacity,
    reduceMotion,
    setShowFloatingXP,
    setXPPosition,
    setShowConfetti,
    timeoutRef,
    burstType = 'default',
    triggerEnhancedCelebration,
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowFloatingXP(false), 1000);
    })();

    // Trigger enhanced celebration if provided
    if (triggerEnhancedCelebration && !reduceMotion) {
      runOnJS(triggerEnhancedCelebration)(burstType);
    }
  };
}

/**
 * Backward-compatible function - creates the original celebration trigger
 * Use this when you don't need the enhanced celebration features
 */
export function createCelebrationTrigger(options: Omit<EnhancedCelebrationOptions, 'burstType' | 'triggerEnhancedCelebration'>) {
  return createEnhancedCelebrationTrigger(options as EnhancedCelebrationOptions);
}

/**
 * Enhanced uncheck trigger - same as original
 */
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
