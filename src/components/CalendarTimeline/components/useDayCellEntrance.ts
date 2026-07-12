/**
 * One-shot staggered entrance for week-strip day cells.
 * Plays once on mount (app open / first paint). Does NOT re-run on week
 * swipe — that was the cold-start "animation churn" we previously removed.
 */
import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';

const ENTRANCE_DURATION = durations.enter;
const STAGGER_DELAY = durations.stagger;
const ENTRANCE_TRANSLATE_Y = 12;

export function useDayCellEntrance(index: number, reduceMotion: boolean) {
  const hasPlayed = useRef(false);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : ENTRANCE_TRANSLATE_Y);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      hasPlayed.current = true;
      return;
    }
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    const delay = index * STAGGER_DELAY;
    const timing = { duration: ENTRANCE_DURATION };
    opacity.value = withDelay(delay, withTiming(1, timing));
    translateY.value = withDelay(delay, withTiming(0, timing));
  }, [index, reduceMotion, opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}
