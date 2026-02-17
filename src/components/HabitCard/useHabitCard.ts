/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * useHabitCard Hook - Core orchestration logic
 *
 * @see docs/offline-habit-sync.md T013 - Offline state integration
 */

import { useCallback } from 'react';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useHabitCardEntrance } from './useHabitCardEntrance';
import { useHabitCardAnimations } from './useHabitCardAnimations';
import { useHabitCardGestures } from './useHabitCardGestures';
import { useHabitCardEffects } from './useHabitCardEffects';
import { useHabitCardState, useStreakMilestoneIntegration } from './hooks';
import { useHabitCardValues } from './useHabitCardValues';
import { getStrengthColor, getBackgroundColor } from './HabitCard.utils';
import type { HabitCardProps } from './HabitCard.types';
import { useMindfulnessTimer } from '../MindfulnessTimer/useMindfulnessTimer';

export function useHabitCard(props: HabitCardProps) {
  const {
    id,
    name,
    icon = '📝',
    color,
    strength,
    currentStreak: currentStreakProp = 0,
    bestStreak: bestStreakProp = 0,
    atRisk = false,
    completed: completedProp = false,
    disabled = false,
    onPress,
    onLongPress,
    entranceVariant = 'widthExpansion',
    entranceDelay = 0,
    triggerEntrance: shouldTriggerEntrance = true,
    onEntranceComplete,
    serverTracking = [],
    offlineSyncEnabled = false,
  } = props;

  const theme = useAppTheme();
  const { colors: themeColors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const values = useHabitCardValues(strength);

  const habitState = useHabitCardState({
    bestStreakProp,
    completedProp,
    currentStreakProp,
    id,
    offlineSyncEnabled,
    serverTracking,
  });

  // Mindfulness timer integration
  const mindfulness = useMindfulnessTimer({
    habitName: name,
    habitIcon: icon,
    completed: habitState.completed,
  });

  // Wrapped toggle that intercepts mindfulness habits
  const wrappedToggleOptimistic = useCallback(() => {
    if (mindfulness.shouldIntercept()) return; // Timer shown instead
    habitState.toggleOptimistic();
  }, [mindfulness, habitState]);

  const wrappedToggleCompletionMutation = useCallback(
    async (args: { date: string; habitId: typeof id }) => {
      if (mindfulness.isMindfulnessHabit && !habitState.completed) return; // Handled by timer
      return habitState.toggleCompletionMutation(args);
    },
    [mindfulness.isMindfulnessHabit, habitState]
  );

  // Integrate streak milestone celebrations
  useStreakMilestoneIntegration({
    currentStreak: habitState.currentStreak,
    habitEmoji: icon,
    habitId: id,
    habitName: name,
    isCompleted: habitState.completed,
  });

  const entrance = useHabitCardEntrance({
    autoTrigger: shouldTriggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  // Wrap the celebration trigger to also show the completion toast
  const triggerCompletionWithToast = useCallback(() => {
    values.setShowCompletionToast(true);
  }, [values]);

  const animations = useHabitCardAnimations({
    cardScale: values.cardScale,
    reduceMotion,
    setShowConfetti: values.setShowConfetti,
    setShowFloatingXP: values.setShowFloatingXP,
    setXPPosition: values.setXPPosition,
    translateX: values.translateX,
  });

  const { composedGesture } = useHabitCardGestures({
    cardScale: values.cardScale,
    completed: habitState.completed,
    disabled,
    id,
    name,
    onLongPress,
    onPress,
    reduceMotion,
    today: habitState.today,
    toggleCompletionMutation: wrappedToggleCompletionMutation,
    toggleOptimistic: wrappedToggleOptimistic,
    translateX: values.translateX,
    triggerCompletionCelebration: () => {
      animations.triggerCompletionCelebration();
      triggerCompletionWithToast();
    },
    triggerUncheckAnimation: animations.triggerUncheckAnimation,
  });

  // Called when mindfulness timer completes — triggers habit completion
  const completeMindfulnessHabit = useCallback(async () => {
    mindfulness.dismissTimer();
    habitState.toggleOptimistic();
    animations.triggerCompletionCelebration();
    triggerCompletionWithToast();
    try {
      await habitState.toggleCompletionMutation({
        date: habitState.today,
        habitId: id,
      });
    } catch (error) {
      if (__DEV__) console.error('Mindfulness completion failed:', error);
      habitState.toggleOptimistic(); // revert
    }
  }, [mindfulness, habitState, animations, triggerCompletionWithToast, id]);

  useHabitCardEffects({
    checkmarkRotate: animations.checkmarkRotate,
    checkmarkScale: animations.checkmarkScale,
    completed: habitState.completed,
    strength,
    strengthFillWidth: values.strengthFillWidth,
  });

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${values.strengthFillWidth.value}%`,
  }));

  return {
    accentColor: color || theme.custom.colors.primary[500],
    animations,
    backgroundColor: getBackgroundColor(
      habitState.completed,
      atRisk,
      theme,
      themeColors.card
    ),
    bestStreak: habitState.bestStreak,
    borderRadius: theme.custom.borderRadius.large,
    completed: habitState.completed,
    composedGesture,
    currentStreak: habitState.currentStreak,
    entrance,
    hasPendingOfflineOps: habitState.hasPendingOfflineOps,
    isDark,
    mindfulness: {
      showTimer: mindfulness.showTimer,
      dismissTimer: mindfulness.dismissTimer,
      completeMindfulnessHabit,
    },
    setShowCompletionToast: values.setShowCompletionToast,
    setShowConfetti: values.setShowConfetti,
    setShowFloatingXP: values.setShowFloatingXP,
    showCompletionToast: values.showCompletionToast,
    showConfetti: values.showConfetti,
    showFloatingXP: values.showFloatingXP,
    strengthColor: getStrengthColor(strength, theme),
    strengthFillStyle,
    theme,
    translateX: values.translateX,
    xpPosition: values.xpPosition,
  };
}
