/**
 * useHabitCard Hook - Core orchestration logic
 */

import { useState } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAppTheme } from '../../theme';
import { useHabitCardEntrance } from './useHabitCardEntrance';
import { useHabitCardAnimations } from './useHabitCardAnimations';
import { useHabitCardGestures } from './useHabitCardGestures';
import { useHabitCardEffects } from './useHabitCardEffects';
import { getStrengthColor, getBackgroundColor } from './HabitCard.utils';
import type { HabitCardProps } from './HabitCard.types';

export function useHabitCard(props: HabitCardProps) {
  const {
    id,
    name,
    color,
    strength,
    atRisk = false,
    completed: completedProp = false,
    disabled = false,
    onPress,
    onLongPress,
    entranceVariant = 'widthExpansion',
    entranceDelay = 0,
    triggerEntrance: shouldTriggerEntrance = true,
    onEntranceComplete,
  } = props;

  const theme = useAppTheme();
  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const strengthFillWidth = useSharedValue(strength);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [xpPosition, setXPPosition] = useState({ x: 0, y: 0 });
  const [isToggling, setIsToggling] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const completedQuery = useQuery(api.tracking.getCompletionStatus, {
    date: today,
    habitId: id,
  });
  const completed = completedQuery ?? completedProp;
  const toggleCompletionMutation = useMutation(api.tracking.toggleCompletion);

  const entrance = useHabitCardEntrance({
    autoTrigger: shouldTriggerEntrance,
    delay: entranceDelay,
    onAnimationComplete: onEntranceComplete,
    variant: entranceVariant,
  });

  const animations = useHabitCardAnimations({
    cardScale,
    setShowFloatingXP,
    setXPPosition,
    translateX,
  });

  const { composedGesture } = useHabitCardGestures({
    cardScale,
    completed,
    disabled,
    id,
    isToggling,
    name,
    onLongPress,
    onPress,
    setIsToggling,
    today,
    toggleCompletionMutation,
    translateX,
    triggerCompletionCelebration: animations.triggerCompletionCelebration,
    triggerUncheckAnimation: animations.triggerUncheckAnimation,
  });

  useHabitCardEffects({
    checkmarkRotate: animations.checkmarkRotate,
    checkmarkScale: animations.checkmarkScale,
    completed,
    strength,
    strengthFillWidth,
  });

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${strengthFillWidth.value}%`,
  }));

  return {
    accentColor: color || theme.custom.colors.primary[500],
    animations,
    backgroundColor: getBackgroundColor(completed, atRisk, theme),
    borderRadius: theme.custom.borderRadius.large,
    completed,
    composedGesture,
    entrance,
    setShowFloatingXP,
    showFloatingXP,
    strengthColor: getStrengthColor(strength, theme),
    strengthFillStyle,
    theme,
    translateX,
    xpPosition,
  };
}
