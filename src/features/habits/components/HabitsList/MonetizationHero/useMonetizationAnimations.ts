/**
 * useMonetizationAnimations — animation lifecycle for {@link MonetizationHero}.
 *
 * Manages three independent `Animated.Value` tracks:
 * 1. **progress** — fills the slot-usage bar to `usageRatio × trackWidth` (420 ms ease-out).
 * 2. **ctaPulse** — loops a gentle 1→1.04 scale on the CTA button when the limit is reached.
 * 3. **shimmer** — loops opacity 0.4↔0.9 on the "Keep 3 habits free" label.
 *
 * All three tracks short-circuit to static values when `reduceMotion` is true.
 * `trackWidth` is measured via `onLayout` so the progress bar works at any width.
 *
 * Performance: Uses Reanimated for smooth UI-thread animations
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const ZERO_VALUE = 0;
const FULL_PROGRESS = 1;
const INITIAL_PULSE_SCALE = 1;
const PULSE_MAX_SCALE = 1.04;
const INITIAL_SHIMMER_OPACITY = 0.4;
const SHIMMER_PEAK_OPACITY = 0.9;
const PROGRESS_ANIMATION_DURATION_MS = 420;
const CTA_PULSE_DURATION_MS = 720;
const SHIMMER_ANIMATION_DURATION_MS = 960;

interface UseMonetizationAnimationsOptions {
  freeHabitLimit: number;
  habitSlotsUsed: number;
  hasReachedHabitLimit: boolean;
  reduceMotion: boolean;
}

export function useMonetizationAnimations({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  reduceMotion,
}: UseMonetizationAnimationsOptions) {
  const progress = useRef(new Animated.Value(ZERO_VALUE)).current;
  const ctaPulse = useRef(new Animated.Value(INITIAL_PULSE_SCALE)).current;
  const shimmer = useRef(new Animated.Value(INITIAL_SHIMMER_OPACITY)).current;
  const [trackWidth, setTrackWidth] = useState(ZERO_VALUE);

  const usageRatio = useMemo(
    () =>
      freeHabitLimit === ZERO_VALUE
        ? ZERO_VALUE
        : Math.min(habitSlotsUsed / freeHabitLimit, FULL_PROGRESS),
    [freeHabitLimit, habitSlotsUsed]
  );

  // Progress bar animation
  useEffect(() => {
    const targetWidth = trackWidth * usageRatio;
    if (reduceMotion) {
      progress.value = targetWidth;
      return;
    }
    const handle = Animated.timing(progress, {
      duration: PROGRESS_ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, trackWidth, usageRatio, reduceMotion]);

  // CTA pulse animation
  useEffect(() => {
    if (reduceMotion || !hasReachedHabitLimit) {
      ctaPulse.stopAnimation();
      ctaPulse.setValue(INITIAL_PULSE_SCALE);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          duration: CTA_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          toValue: PULSE_MAX_SCALE,
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          duration: CTA_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          toValue: INITIAL_PULSE_SCALE,
          useNativeDriver: true,
        }),
      ])
    );
  }, [ctaPulse, hasReachedHabitLimit, reduceMotion]);

  // Shimmer animation
  useEffect(() => {
    if (reduceMotion) {
      shimmer.setValue(FULL_PROGRESS);
      return;
    }
    const wave = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          duration: SHIMMER_ANIMATION_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          toValue: SHIMMER_PEAK_OPACITY,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          duration: SHIMMER_ANIMATION_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          toValue: INITIAL_SHIMMER_OPACITY,
          useNativeDriver: true,
        }),
      ])
    );
  }, [shimmer, reduceMotion]);

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(event.nativeEvent.layout.width);
    },
    []
  );

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  const ctaPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return {
    ctaPulseStyle,
    handleTrackLayout,
    progressStyle,
    shimmerStyle,
    trackWidth,
  };
}
