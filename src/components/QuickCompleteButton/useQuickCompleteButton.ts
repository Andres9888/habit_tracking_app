/**
 * useQuickCompleteButton Hook
 * Manages state and animations for the QuickCompleteButton
 */

import { useState, useEffect } from 'react';
import {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useReduceMotion } from '../../hooks/useReduceMotion';
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

  const { buttonAnimatedStyle, checkAnimatedStyle } =
    useQuickCompleteAnimations({
      buttonScale,
      checkRotation,
      checkScale,
    });

  const toggleCompletionMutation = useMutation(api.habits.toggleHabit);
  const today = new Date().toISOString().split('T')[0];

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
        : Haptics.ImpactFeedbackStyle.Heavy
    );
    buttonScale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (wasCompleted) {
      checkScale.value = withTiming(0, { duration: 150 });
      checkRotation.value = withTiming(-90, { duration: 150 });
      onUncomplete?.();
    } else {
      checkScale.value = withSequence(
        withSpring(1.3, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      );
      checkRotation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      if (!reduceMotion) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 700);
      }
      onComplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
    } catch (error) {
      setLocalCompleted(wasCompleted);
      checkScale.value = wasCompleted ? 1 : 0;
      checkRotation.value = wasCompleted ? 0 : -90;
      console.error('Failed to toggle completion:', error);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
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
