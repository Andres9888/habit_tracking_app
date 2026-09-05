/**
 * useStreakGoalAnimation — animates the goal progress bar, count-up numeral,
 * label reveal, and goal-reached celebration pulse.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '../../../theme/animations';
import { triggerHaptic } from '../../../utils/haptics';

/** NaN-guard + round to avoid Reanimated precision errors. */
const safeRound = (value: number) =>
  typeof value === 'number' && !Number.isNaN(value) ? Math.round(value) : 0;

const timingConfig = {
  duration: durations.progress,
  easing: Easing.out(Easing.cubic),
};

export function useStreakGoalAnimation(
  overallPercent: number,
  daysRemaining: number,
  currentStreak: number,
  streakGoal: number
) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const streakCount = useSharedValue(0);
  const days = useSharedValue(safeRound(daysRemaining));
  const barPulse = useSharedValue(1);
  const prevStreakRef = useRef(currentStreak);
  const [percentText, setPercentText] = useState(0);
  const [daysText, setDaysText] = useState(safeRound(daysRemaining));
  const [streakText, setStreakText] = useState(0);
  const [showLabels, setShowLabels] = useState(reduceMotion);

  const targetPercent = safeRound(overallPercent);
  const targetDays = safeRound(daysRemaining);
  const isGoalReached = streakGoal > 0 && currentStreak >= streakGoal;

  useEffect(() => {
    progress.value = reduceMotion
      ? targetPercent
      : withTiming(targetPercent, timingConfig);
    streakCount.value = reduceMotion
      ? currentStreak
      : withTiming(currentStreak, timingConfig);
    days.value = reduceMotion
      ? targetDays
      : withTiming(targetDays, timingConfig);

    if (reduceMotion) {
      setShowLabels(true);
      return;
    }

    setShowLabels(false);
    const timer = setTimeout(() => setShowLabels(true), durations.progress);
    return () => clearTimeout(timer);
  }, [
    targetPercent,
    targetDays,
    currentStreak,
    reduceMotion,
    progress,
    streakCount,
    days,
  ]);

  useEffect(() => {
    const wasBelow = prevStreakRef.current < streakGoal;
    const nowReached = currentStreak >= streakGoal && streakGoal > 0;
    if (wasBelow && nowReached && !reduceMotion) {
      void triggerHaptic('streak');
      barPulse.value = withSequence(
        withSpring(1.04, springs.celebration),
        withSpring(1, springs.celebration)
      );
    }
    prevStreakRef.current = currentStreak;
  }, [currentStreak, streakGoal, reduceMotion, barPulse]);

  useDerivedValue(() => {
    runOnJS(setPercentText)(Math.trunc(progress.value + 0.5));
  }, [progress]);

  useDerivedValue(() => {
    runOnJS(setDaysText)(Math.trunc(days.value + 0.5));
  }, [days]);

  useDerivedValue(() => {
    runOnJS(setStreakText)(Math.trunc(streakCount.value + 0.5));
  }, [streakCount]);

  const barStyle = useAnimatedStyle(() => ({
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    transform: [{ scaleX: barPulse.value }],
    transformOrigin: 'left',
    width: `${progress.value}%`,
  }));

  return {
    barStyle,
    daysText,
    isGoalReached,
    percentText,
    showLabels,
    streakText,
  };
}
