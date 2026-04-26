import { getTodayString } from '../../utils/getLocalDateString';
/**
 * useQuickCompleteButton Hook
 * Manages state and animations for the QuickCompleteButton
 */

import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import { useQuickCompleteAnimations } from './useQuickCompleteAnimations';
import type { QuickCompleteButtonProps } from './QuickCompleteButton.types';

type UseQuickCompleteButtonParams = Pick<
  QuickCompleteButtonProps,
  'completedToday' | 'habitId' | 'onComplete' | 'onUncomplete'
>;

export function useQuickCompleteButton({
  completedToday,
  habitId,
  onComplete,
  onUncomplete,
}: UseQuickCompleteButtonParams) {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(completedToday);
  const [showConfetti, setShowConfetti] = useState(false);
  const reduceMotion = useReduceMotion();

  const buttonScale = useSharedValue(1);
  const checkScale = useSharedValue(completedToday ? 1 : 0);
  const checkRotation = useSharedValue(completedToday ? 0 : -90);

  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
      if (toggleTimeoutRef.current) clearTimeout(toggleTimeoutRef.current);
    };
  }, []);

  const { buttonAnimatedStyle, checkAnimatedStyle } =
    useQuickCompleteAnimations({
      buttonScale,
      checkRotation,
      checkScale,
    });

  const toggleCompletionMutation = useToggleHabitWithTimezone();
  const today = getTodayString();

  useEffect(() => {
    setLocalCompleted(completedToday);
    checkScale.value = completedToday ? 1 : 0;
    checkRotation.value = completedToday ? 0 : -90;
  }, [completedToday]);

  const handlePress = async () => {
    if (isToggling) return;
    setIsToggling(true);

    Haptics.impactAsync(
      localCompleted
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );
    buttonScale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, springs.celebration)
    );

    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (wasCompleted) {
      checkScale.value = withTiming(0, { duration: 150 });
      checkRotation.value = withTiming(-90, { duration: 150 });
      onUncomplete?.();
    } else {
      checkScale.value = withSequence(
        withSpring(1.3, springs.celebration),
        withSpring(1, springs.bouncy)
      );
      checkRotation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      if (!reduceMotion) {
        setShowConfetti(true);
        if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 700);
      }
      onComplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
    } catch (error) {
      setLocalCompleted(wasCompleted);
      checkScale.value = wasCompleted ? 1 : 0;
      checkRotation.value = wasCompleted ? 0 : -90;
      if (__DEV__) console.error('Failed to toggle completion:', error);
    } finally {
      if (toggleTimeoutRef.current) clearTimeout(toggleTimeoutRef.current);
      toggleTimeoutRef.current = setTimeout(() => setIsToggling(false), 300);
    }
  };

  return {
    buttonAnimatedStyle,
    checkAnimatedStyle,
    handlePress,
    isToggling,
    localCompleted,
    showConfetti,
  };
}
