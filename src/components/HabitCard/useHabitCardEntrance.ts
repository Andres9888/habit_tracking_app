/**
 * useHabitCardEntrance Hook
 *
 * Manages habit card entrance animation state for smooth visual transitions
 * when cards appear in the list. Supports multiple animation variants for A/B testing.
 *
 * Based on UX Specification: habit-card-entrance-animation-spec.md
 *
 * @example
 * ```tsx
 * const { cardStyle, accentStyle, contentStyle, triggerEntrance } = useHabitCardEntrance({
 *   variant: 'accentSlideDown',
 *   delay: 100,
 *   onAnimationComplete: () => console.log('Animation done'),
 * });
 * ```
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';

/**
 * Available animation variants for habit card entrance.
 *
 * - `fadeUp`: Simple fade + translate up (current baseline)
 * - `accentSlideDown`: Accent bar slides down from top, then content fades in (RECOMMENDED)
 * - `widthExpansion`: Card fades up, accent bar width grows from 0 to 6px
 * - `none`: No animation, instant appearance
 */
export type HabitCardEntranceVariant =
  | 'fadeUp'
  | 'accentSlideDown'
  | 'widthExpansion'
  | 'none';

export interface UseHabitCardEntranceOptions {
  /**
   * Animation variant to use.
   * @default 'accentSlideDown'
   */
  variant?: HabitCardEntranceVariant;

  /**
   * Delay before animation starts (for stagger effects).
   * @default 0
   */
  delay?: number;

  /**
   * Callback fired when entrance animation completes.
   */
  onAnimationComplete?: () => void;

  /**
   * Whether to trigger animation on mount.
   * @default true
   */
  autoTrigger?: boolean;
}

export interface HabitCardEntranceStyles {
  /** Animated styles for the card container */
  cardStyle: ReturnType<typeof useAnimatedStyle>;
  /** Animated styles for the accent bar */
  accentStyle: ReturnType<typeof useAnimatedStyle>;
  /** Animated styles for the content area */
  contentStyle: ReturnType<typeof useAnimatedStyle>;
}

export interface UseHabitCardEntranceReturn extends HabitCardEntranceStyles {
  /** Manually trigger the entrance animation */
  triggerEntrance: () => void;
  /** Reset animation to initial state */
  resetAnimation: () => void;
  /** Whether animation is currently running */
  isAnimating: SharedValue<boolean>;
}

/**
 * Spring configuration for accent bar slide animation.
 * Uses ease-out-back feel for a subtle overshoot.
 */
const ACCENT_SPRING_CONFIG = {
  ...Springs.gentle,
  // Slightly lower damping for subtle overshoot (ease-out-back feel)
  damping: 24,
};

/**
 * Animation timing constants (in milliseconds).
 * All durations are designed to feel snappy but not rushed.
 */
const TIMING = {
  /** Accent bar slide/scale duration */
  accentSlide: 250,

  /** Card container fade-in duration */
  cardFadeIn: 150,
  /** Content fade-in duration */
  contentFadeIn: 300,

  /** Simple fade-up duration (baseline) */
  fadeUp: 350,

  /** Width expansion duration */
  widthExpansion: 200,
} as const;

/**
 * Hook to manage habit card entrance animation state.
 *
 * Returns animated style objects for card, accent bar, and content,
 * along with functions to trigger and reset the animation.
 */
export function useHabitCardEntrance({
  variant = 'accentSlideDown',
  delay = 0,
  onAnimationComplete,
  autoTrigger = true,
}: UseHabitCardEntranceOptions = {}): UseHabitCardEntranceReturn {
  const reduceMotion = useReduceMotion();
  const hasTriggered = useRef(false);

  // ============================================
  // Shared Values for Animation State
  // ============================================

  // Card container
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  // Accent bar
  const accentScaleY = useSharedValue(0);
  const accentWidth = useSharedValue(0);
  const accentOpacity = useSharedValue(0);

  // Content
  const contentOpacity = useSharedValue(0);
  const contentTranslateX = useSharedValue(-10);

  // Animation state
  const isAnimating = useSharedValue(false);

  // ============================================
  // Animation Functions
  // ============================================

  /**
   * Set all values to their final "visible" state instantly.
   * Used when reduce motion is enabled or variant is 'none'.
   */
  const setInstantVisible = useCallback(() => {
    'worklet';
    cardOpacity.value = 1;
    cardTranslateY.value = 0;
    accentScaleY.value = 1;
    accentWidth.value = 6;
    accentOpacity.value = 1;
    contentOpacity.value = 1;
    contentTranslateX.value = 0;
  }, [
    cardOpacity,
    cardTranslateY,
    accentScaleY,
    accentWidth,
    accentOpacity,
    contentOpacity,
    contentTranslateX,
  ]);

  /**
   * Variation 1: Simple fade up (baseline).
   * Card + accent fade up together.
   */
  const runFadeUp = useCallback(() => {
    'worklet';
    const duration = TIMING.fadeUp;

    // Everything fades in and translates together
    cardOpacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    cardTranslateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    // Accent bar is visible immediately
    accentScaleY.value = 1;
    accentWidth.value = 6;
    accentOpacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    // Content fades in with card
    contentOpacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    contentTranslateX.value = 0;

    // Mark animation complete after duration
    cardOpacity.value = withTiming(1, { duration }, (finished) => {
      if (finished) {
        isAnimating.value = false;
        if (onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }
    });
  }, [
    cardOpacity,
    cardTranslateY,
    accentScaleY,
    accentWidth,
    accentOpacity,
    contentOpacity,
    contentTranslateX,
    isAnimating,
    onAnimationComplete,
  ]);

  /**
   * Variation 2: Accent slides down first (RECOMMENDED).
   * Sequence:
   * 1. Card container fades in (150ms)
   * 2. Accent bar slides down from top (250ms, spring with ease-out-back feel)
   * 3. Content fades in from left (300ms)
   */
  const runAccentSlideDown = useCallback(() => {
    'worklet';

    // Phase 1: Card container fades in
    cardOpacity.value = withTiming(1, {
      duration: TIMING.cardFadeIn,
      easing: Easing.out(Easing.cubic),
    });
    cardTranslateY.value = 0; // No translate for this variant

    // Accent bar starts invisible
    accentOpacity.value = withTiming(1, {
      duration: TIMING.cardFadeIn,
      easing: Easing.out(Easing.cubic),
    });
    accentWidth.value = 6; // Full width from start

    // Phase 2: Accent bar slides down (scaleY from 0 to 1, origin top)
    // Delayed by card fade-in duration
    accentScaleY.value = withDelay(
      TIMING.cardFadeIn,
      withSpring(1, ACCENT_SPRING_CONFIG)
    );

    // Phase 3: Content fades in from left
    // Delayed by card fade + accent slide
    const contentDelay = TIMING.cardFadeIn + TIMING.accentSlide * 0.5;
    contentOpacity.value = withDelay(
      contentDelay,
      withTiming(1, {
        duration: TIMING.contentFadeIn,
        easing: Easing.out(Easing.cubic),
      })
    );
    contentTranslateX.value = withDelay(
      contentDelay,
      withTiming(0, {
        duration: TIMING.contentFadeIn,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Mark animation complete after all phases
    const totalDuration = contentDelay + TIMING.contentFadeIn;
    contentOpacity.value = withDelay(
      contentDelay,
      withTiming(1, { duration: TIMING.contentFadeIn }, (finished) => {
        if (finished) {
          isAnimating.value = false;
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      })
    );
  }, [
    cardOpacity,
    cardTranslateY,
    accentOpacity,
    accentWidth,
    accentScaleY,
    contentOpacity,
    contentTranslateX,
    isAnimating,
    onAnimationComplete,
  ]);

  /**
   * Variation 6: Width expansion.
   * Sequence:
   * 1. Card fades up normally (350ms)
   * 2. Accent bar width grows 0 → 6px (200ms, spring with ease-out-back feel)
   */
  const runWidthExpansion = useCallback(() => {
    'worklet';

    // Phase 1: Card fades up normally
    cardOpacity.value = withTiming(1, {
      duration: TIMING.fadeUp,
      easing: Easing.out(Easing.cubic),
    });
    cardTranslateY.value = withTiming(0, {
      duration: TIMING.fadeUp,
      easing: Easing.out(Easing.cubic),
    });

    // Accent bar visible but zero width
    accentScaleY.value = 1;
    accentOpacity.value = withTiming(1, {
      duration: TIMING.fadeUp,
      easing: Easing.out(Easing.cubic),
    });

    // Content fades in with card
    contentOpacity.value = withTiming(1, {
      duration: TIMING.fadeUp,
      easing: Easing.out(Easing.cubic),
    });
    contentTranslateX.value = 0;

    // Phase 2: Accent bar width expands
    // Delayed by fade-up duration
    accentWidth.value = withDelay(
      TIMING.fadeUp,
      withSpring(6, {
        ...Springs.gentle,
        damping: 20, // More bounce for subtle ease-out-back feel
      })
    );

    // Mark animation complete
    const totalDuration = TIMING.fadeUp + TIMING.widthExpansion;
    accentWidth.value = withDelay(
      TIMING.fadeUp,
      withSpring(6, { ...Springs.gentle, damping: 20 }, (finished) => {
        if (finished) {
          isAnimating.value = false;
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      })
    );
  }, [
    cardOpacity,
    cardTranslateY,
    accentScaleY,
    accentOpacity,
    accentWidth,
    contentOpacity,
    contentTranslateX,
    isAnimating,
    onAnimationComplete,
  ]);

  /**
   * Trigger the entrance animation based on the selected variant.
   */
  const triggerEntrance = useCallback(() => {
    if (__DEV__) {
      console.log(
        `[useHabitCardEntrance] triggerEntrance called, variant=${variant}, reduceMotion=${reduceMotion}`
      );
    }

    // Respect reduce motion preference
    if (reduceMotion || variant === 'none') {
      setInstantVisible();
      isAnimating.value = false;
      onAnimationComplete?.();
      return;
    }

    isAnimating.value = true;

    // Apply delay if specified (for stagger effects)
    const executeAnimation = () => {
      'worklet';
      switch (variant) {
        case 'fadeUp': {
          runFadeUp();
          break;
        }
        case 'accentSlideDown': {
          runAccentSlideDown();
          break;
        }
        case 'widthExpansion': {
          runWidthExpansion();
          break;
        }
        default: {
          runAccentSlideDown();
        }
      }
    };

    if (delay > 0) {
      // Use withDelay to defer the animation start
      cardOpacity.value = withDelay(
        delay,
        withTiming(0, { duration: 0 }, () => {
          executeAnimation();
        })
      );
      // Actually start after delay
      setTimeout(() => {
        executeAnimation();
      }, delay);
    } else {
      executeAnimation();
    }
  }, [
    reduceMotion,
    variant,
    delay,
    setInstantVisible,
    isAnimating,
    onAnimationComplete,
    runFadeUp,
    runAccentSlideDown,
    runWidthExpansion,
    cardOpacity,
  ]);

  /**
   * Reset animation to initial (hidden) state.
   */
  const resetAnimation = useCallback(() => {
    // Cancel any running animations
    cancelAnimation(cardOpacity);
    cancelAnimation(cardTranslateY);
    cancelAnimation(accentScaleY);
    cancelAnimation(accentWidth);
    cancelAnimation(accentOpacity);
    cancelAnimation(contentOpacity);
    cancelAnimation(contentTranslateX);

    // Reset to initial values
    cardOpacity.value = 0;
    cardTranslateY.value = 20;
    accentScaleY.value = 0;
    accentWidth.value = 0;
    accentOpacity.value = 0;
    contentOpacity.value = 0;
    contentTranslateX.value = -10;
    isAnimating.value = false;
    hasTriggered.current = false;
  }, [
    cardOpacity,
    cardTranslateY,
    accentScaleY,
    accentWidth,
    accentOpacity,
    contentOpacity,
    contentTranslateX,
    isAnimating,
  ]);

  // ============================================
  // Animated Styles
  // ============================================

  /**
   * Animated styles for the card container.
   * Handles opacity and translateY for fade-up effect.
   */
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  /**
   * Animated styles for the accent bar.
   * Handles scaleY (slide-down), width (expansion), and opacity.
   * Note: transformOrigin 'top' is simulated by translateY adjustment.
   */
  const accentStyle = useAnimatedStyle(() => {
    // For scaleY with origin at top, we need to adjust translateY
    // When scaleY is 0, bar should be at top; when 1, at normal position
    // This creates the "slide down from top" effect
    // Note: accentScaleY is 1 for non-slideDown variants, so offset is 0
    const translateYOffset = (1 - accentScaleY.value) * -50;

    return {
      opacity: accentOpacity.value,

      transform: [
        { scaleY: accentScaleY.value },
        { translateY: translateYOffset },
      ],
      // Always use accentWidth.value - each animation variant sets it appropriately
      // (widthExpansion animates 0→6, others set 6 immediately)
      width: accentWidth.value,
    };
  });

  /**
   * Animated styles for the content area.
   * Handles opacity and translateX for fade-in-from-left effect.
   */
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  // ============================================
  // Auto-trigger on Mount
  // ============================================

  useEffect(() => {
    if (__DEV__) {
      console.log(
        `[useHabitCardEntrance] useEffect: autoTrigger=${autoTrigger}, hasTriggered=${hasTriggered.current}`
      );
    }

    if (autoTrigger && !hasTriggered.current) {
      // Trigger animation for new cards
      hasTriggered.current = true;
      triggerEntrance();
    } else if (!autoTrigger && !hasTriggered.current) {
      // For cards that shouldn't animate (already seen), make them instantly visible
      if (__DEV__) {
        console.log(
          `[useHabitCardEntrance] Setting instant visible (autoTrigger=false)`
        );
      }
      setInstantVisible();
    }

    // Cleanup on unmount
    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
      cancelAnimation(accentScaleY);
      cancelAnimation(accentWidth);
      cancelAnimation(accentOpacity);
      cancelAnimation(contentOpacity);
      cancelAnimation(contentTranslateX);
    };
  }, [autoTrigger, triggerEntrance, setInstantVisible]);

  return {
    accentStyle,
    cardStyle,
    contentStyle,
    isAnimating,
    resetAnimation,
    triggerEntrance,
  };
}

export default useHabitCardEntrance;
