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
  const progress = useRef(new Animated.Value(0)).current;
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
      progress.setValue(trackWidth * usageRatio);
      return;
    }
    const handle = Animated.timing(progress, {
      duration: 420,
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

  return { ctaPulse, handleTrackLayout, progress, shimmer, trackWidth };
}
