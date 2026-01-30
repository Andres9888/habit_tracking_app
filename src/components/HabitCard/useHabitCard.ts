/**
 * useHabitCard Hook - Core orchestration logic
 *
 * @see docs/offline-habit-sync.md T013 - Offline state integration
 */

import { useAnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { useHabitCardEntrance } from './useHabitCardEntrance';
import { useHabitCardAnimations } from './useHabitCardAnimations';
import { useHabitCardGestures } from './useHabitCardGestures';
import { useHabitCardEffects } from './useHabitCardEffects';
import { useHabitCardState } from './hooks';
import { useHabitCardValues } from './useHabitCardValues';
import { getStrengthColor, getBackgroundColor } from './HabitCard.utils';
import type { HabitCardProps } from './HabitCard.types';

export function useHabitCard(props: HabitCardProps) {
  const {
    id,
    name,
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
  const values = useHabitCardValues(strength);

  const habitState = useHabitCardState({
    bestStreakProp,
    completedProp,
    currentStreakProp,
    id,
    offlineSyncEnabled,
    serverTracking,
  });

  const entrance = useHabitCardEntrance({
    autoTrigger: shouldTriggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  const animations = useHabitCardAnimations({
    cardScale: values.cardScale,
    setShowFloatingXP: values.setShowFloatingXP,
    setXPPosition: values.setXPPosition,
    translateX: values.translateX,
  });

  const { composedGesture } = useHabitCardGestures({
    cardScale: values.cardScale,
    completed: habitState.completed,
    disabled,
    id,
    isToggling: values.isToggling,
    name,
    onLongPress,
    onPress,
    setIsToggling: values.setIsToggling,
    today: habitState.today,
    toggleCompletionMutation: habitState.toggleCompletionMutation,
    translateX: values.translateX,
    triggerCompletionCelebration: animations.triggerCompletionCelebration,
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
    backgroundColor: getBackgroundColor(habitState.completed, atRisk, theme),
    bestStreak: habitState.bestStreak,
    borderRadius: theme.custom.borderRadius.large,
    completed: habitState.completed,
    composedGesture,
    currentStreak: habitState.currentStreak,
    entrance,
    hasPendingOfflineOps: habitState.hasPendingOfflineOps,
    setShowFloatingXP: values.setShowFloatingXP,
    showFloatingXP: values.showFloatingXP,
    strengthColor: getStrengthColor(strength, theme),
    strengthFillStyle,
    theme,
    translateX: values.translateX,
    xpPosition: values.xpPosition,
  };
}
