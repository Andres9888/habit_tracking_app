/**
 * Entry Animation Hooks for Redesigned Paywall
 * Staggered entry: 100-450ms, ease-out
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { MOTION } from './paywall.constants';

const EASE_OUT = Easing.out(Easing.ease);

/** Background fade-in */
export function useBackgroundAnimation(
  visible: boolean,
  reduceMotion: boolean
) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withDelay(
      MOTION.background.delay,
      withTiming(1, { duration: MOTION.background.duration, easing: EASE_OUT })
    );
  }, [visible, reduceMotion, opacity]);
  return {
    animatedStyle: useAnimatedStyle(() => ({ opacity: opacity.value })),
  };
}

/** Headline entry (fade + translate up 16px) */
export function useHeadlineAnimation(visible: boolean, reduceMotion: boolean) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 16);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = 16;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withDelay(
      MOTION.headline.delay,
      withTiming(1, { duration: MOTION.headline.duration, easing: EASE_OUT })
    );
    translateY.value = withDelay(
      MOTION.headline.delay,
      withTiming(0, { duration: MOTION.headline.duration, easing: EASE_OUT })
    );
  }, [visible, reduceMotion, opacity, translateY]);
  return {
    animatedStyle: useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    })),
  };
}

/** Features entry (fade + translate up 12px) */
export function useFeaturesAnimation(visible: boolean, reduceMotion: boolean) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 12);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = 12;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withDelay(
      MOTION.features.delay,
      withTiming(1, { duration: MOTION.features.duration, easing: EASE_OUT })
    );
    translateY.value = withDelay(
      MOTION.features.delay,
      withTiming(0, { duration: MOTION.features.duration, easing: EASE_OUT })
    );
  }, [visible, reduceMotion, opacity, translateY]);
  return {
    animatedStyle: useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    })),
  };
}

/** Yearly card entry (fade + translate up 8px + scale pulse) */
export function useYearlyCardAnimation(
  visible: boolean,
  reduceMotion: boolean
) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 8);
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = 8;
      scale.value = 1;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }
    const dur = MOTION.yearlyCard.duration;
    opacity.value = withDelay(
      MOTION.yearlyCard.delay,
      withTiming(1, { duration: dur, easing: EASE_OUT })
    );
    translateY.value = withDelay(
      MOTION.yearlyCard.delay,
      withTiming(0, { duration: dur, easing: EASE_OUT })
    );
    scale.value = withDelay(
      MOTION.yearlyCard.delay,
      withSequence(
        withTiming(1.02, { duration: dur / 2, easing: EASE_OUT }),
        withTiming(1, { duration: dur / 2, easing: EASE_OUT })
      )
    );
  }, [visible, reduceMotion, opacity, translateY, scale]);
  return {
    animatedStyle: useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    })),
  };
}

/** Monthly card entry (fade + translate up 8px) */
export function useMonthlyCardAnimation(
  visible: boolean,
  reduceMotion: boolean
) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 8);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = 8;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withDelay(
      MOTION.monthlyCard.delay,
      withTiming(1, { duration: MOTION.monthlyCard.duration, easing: EASE_OUT })
    );
    translateY.value = withDelay(
      MOTION.monthlyCard.delay,
      withTiming(0, { duration: MOTION.monthlyCard.duration, easing: EASE_OUT })
    );
  }, [visible, reduceMotion, opacity, translateY]);
  return {
    animatedStyle: useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    })),
  };
}

/** CTA entry (fade) */
export function useCTAEntryAnimation(visible: boolean, reduceMotion: boolean) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      return;
    }
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withDelay(
      MOTION.cta.delay,
      withTiming(1, { duration: MOTION.cta.duration, easing: EASE_OUT })
    );
  }, [visible, reduceMotion, opacity]);
  return {
    animatedStyle: useAnimatedStyle(() => ({ opacity: opacity.value })),
  };
}
