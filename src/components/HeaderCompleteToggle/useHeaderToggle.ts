/**
 * Hook for HeaderCompleteToggle toggle logic
 */

import { useState, useCallback, useEffect } from 'react';
import {
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../hooks/useReduceMotion';

interface UseHeaderToggleProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

export function useHeaderToggle({
  completedToday,
  habitId,
  onComplete,
  onUncomplete,
}: UseHeaderToggleProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(completedToday);
  const [showConfetti, setShowConfetti] = useState(false);
  const reduceMotion = useReduceMotion();

  const buttonScale = useSharedValue(1);

  const toggleCompletionMutation = useMutation(api.habits.toggleHabit);
  const today = new Date().toISOString().split('T')[0];

  // Sync local state with prop - always trust the source of truth
  useEffect(() => {
    setLocalCompleted(completedToday);
  }, [completedToday]);

  const handlePress = useCallback(async () => {
    if (isToggling) return;

    setIsToggling(true);

    // Haptic feedback
    Haptics.impactAsync(
      localCompleted
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );

    // Button animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 60 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Optimistic update
    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (!wasCompleted && !reduceMotion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
      onComplete?.();
    } else if (wasCompleted) {
      onUncomplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
      // Mutation succeeded - prop will update via Convex reactivity
    } catch (error) {
      // Revert on error
      setLocalCompleted(wasCompleted);
      console.error('Failed to toggle completion:', error);
    } finally {
      setIsToggling(false);
    }
  }, [
    isToggling,
    localCompleted,
    reduceMotion,
    habitId,
    today,
    toggleCompletionMutation,
    buttonScale,
    onComplete,
    onUncomplete,
  ]);

  return {
    buttonScale,
    handlePress,
    isToggling,
    localCompleted,
    showConfetti,
  };
}
