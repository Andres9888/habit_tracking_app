import { getTodayString } from '../../utils/getLocalDateString';
/**
 * Hook for HeaderCompleteToggle toggle logic
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { Id } from '../../../convex/_generated/dataModel';
import { useToggleHabitWithTimezone } from '../../hooks/useToggleHabitWithTimezone';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

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
  const { triggerSuccess, triggerLightImpact } = useHapticFeedback();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggleCompletionMutation = useToggleHabitWithTimezone();
  const today = getTodayString();

  // Sync local state with prop - always trust the source of truth
  useEffect(() => {
    setLocalCompleted(completedToday);
  }, [completedToday]);

  const handlePress = useCallback(async () => {
    if (isToggling) return;

    setIsToggling(true);

    // Haptic feedback: success pattern when completing, light tap when uncompleting
    if (!localCompleted) {
      triggerSuccess();
    } else {
      triggerLightImpact();
    }

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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowConfetti(false), 500);
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
      if (__DEV__) console.error('Failed to toggle completion:', error);
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
    triggerSuccess,
    triggerLightImpact,
  ]);

  return {
    buttonScale,
    handlePress,
    isToggling,
    localCompleted,
    showConfetti,
  };
}
