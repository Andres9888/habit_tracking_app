/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * useHabitCard — Core orchestration hook for the HabitCard component.
 *
 * This is the "brain" of HabitCard. It composes several specialized hooks
 * and returns a single object that HabitCard.tsx renders against:
 *
 * **Composed hooks (in order of invocation):**
 * 1. {@link useHabitCardValues} — Shared animation values & React state (translateX, scale, confetti, etc.)
 * 2. {@link useHabitCardState} — Completion, streak, and offline-sync state
 * 3. {@link useStreakMilestoneIntegration} — Fires global milestone celebrations on streak thresholds
 * 4. {@link useHabitCardEntrance} — Card mount/entrance animations
 * 5. {@link useHabitCardAnimations} — Completion celebration & checkmark animations
 * 6. {@link useHabitCardGestures} — Tap, pan, long-press gesture composition
 * 7. {@link useHabitCardEffects} — Side-effects syncing props → animated values
 *
 * **Return shape:** A flat object containing all derived state, animated styles,
 * gesture handlers, and callbacks the component needs. See the `return` block
 * at the bottom for the full contract.
 *
 * @see docs/offline-habit-sync.md T013 — Offline state integration
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
