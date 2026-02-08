/**
 * Monetization Hero Animations Hook
 * Manages progress, pulse, and shimmer animations
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

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
  const progressScaleX = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const usageRatio = useMemo(
    () =>
      freeHabitLimit === 0 ? 0 : Math.min(habitSlotsUsed / freeHabitLimit, 1),
    [freeHabitLimit, habitSlotsUsed]
  );

  useEffect(() => {
    if (reduceMotion) {
      progressScaleX.setValue(usageRatio);
      return;
    }
    const handle = Animated.timing(progressScaleX, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
      toValue: usageRatio,
      useNativeDriver: true,
    });
    handle.start();
    return () => {
      handle.stop();
    };
  }, [progressScaleX, usageRatio, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !hasReachedHabitLimit) {
      ctaPulse.stopAnimation();
      ctaPulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          toValue: 1.04,
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ctaPulse, hasReachedHabitLimit, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      shimmer.setValue(1);
      return;
    }
    const wave = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.4,
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

  return { ctaPulse, handleTrackLayout, progressScaleX, shimmer, trackWidth };
}
