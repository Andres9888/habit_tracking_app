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
    toggleCompletionMutation: habitState.toggleCompletionMutation,
    toggleOptimistic: habitState.toggleOptimistic,
    translateX: values.translateX,
    triggerCompletionCelebration: () => {
      animations.triggerCompletionCelebration();
      triggerCompletionWithToast();
    },
    triggerUncheckAnimation: animations.triggerUncheckAnimation,
  });

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
