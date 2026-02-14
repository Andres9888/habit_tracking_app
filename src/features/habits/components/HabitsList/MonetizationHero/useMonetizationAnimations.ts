/**
 * Monetization Hero Animations Hook
 * Manages progress, pulse, and shimmer animations
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

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

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(trackWidth * usageRatio);
      return;
    }
    const handle = Animated.timing(progress, {
      duration: PROGRESS_ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      toValue: trackWidth * usageRatio,
      useNativeDriver: false,
    });
    handle.start();
    return () => {
      handle.stop();
    };
  }, [progress, trackWidth, usageRatio, reduceMotion]);

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
    loop.start();
    return () => loop.stop();
  }, [ctaPulse, hasReachedHabitLimit, reduceMotion]);

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
    wave.start();
    return () => wave.stop();
  }, [shimmer, reduceMotion]);

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(event.nativeEvent.layout.width);
    },
    []
  );

  return { ctaPulse, handleTrackLayout, progress, shimmer, trackWidth };
}
