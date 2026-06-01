/**
 * useStreakGoalAnimation — animates the goal progress bar + counting numbers.
 * Bar fills from 0 on mount and re-animates whenever the goal (and thus the
 * percentage / days remaining) changes. Mirrors the strength-hero pattern.
 */
import { useEffect, useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

/** NaN-guard + round to avoid Reanimated precision errors. */
const safeRound = (value: number) =>
  typeof value === 'number' && !Number.isNaN(value) ? Math.round(value) : 0;

const timingConfig = {
  duration: durations.progress,
  easing: Easing.out(Easing.cubic),
};

export function useStreakGoalAnimation(
  overallPercent: number,
  daysRemaining: number
) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);
  const days = useSharedValue(safeRound(daysRemaining));
  const [percentText, setPercentText] = useState(0);
  const [daysText, setDaysText] = useState(safeRound(daysRemaining));

  const targetPercent = safeRound(overallPercent);
  const targetDays = safeRound(daysRemaining);

  useEffect(() => {
    progress.value = reduceMotion
      ? targetPercent
      : withTiming(targetPercent, timingConfig);
    days.value = reduceMotion ? targetDays : withTiming(targetDays, timingConfig);
  }, [targetPercent, targetDays, reduceMotion, progress, days]);

  useDerivedValue(() => {
    runOnJS(setPercentText)(Math.trunc(progress.value + 0.5));
  }, [progress]);

  useDerivedValue(() => {
    runOnJS(setDaysText)(Math.trunc(days.value + 0.5));
  }, [days]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return { barStyle, percentText, daysText };
}
