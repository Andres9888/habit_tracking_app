/**
 * HabitCard Component - Main orchestration
 * Purpose: Display individual habit with tracking info, gestures, and animations
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAppTheme } from '../../theme';
import FloatingXPText from '../FloatingXPText/FloatingXPText';
import { useHabitCardEntrance } from './useHabitCardEntrance';
import { useHabitCardAnimations } from './useHabitCardAnimations';
import { useHabitCardGestures } from './useHabitCardGestures';
import { getStrengthColor, getBackgroundColor } from './HabitCard.utils';
import { styles } from './HabitCard.styles';
import type { HabitCardProps } from './HabitCard.types';
import {
  SwipeActions,
  StrengthFillBackground,
  HabitCardContent,
} from './components';

export type { HabitCardProps } from './HabitCard.types';

export function HabitCard(props: HabitCardProps) {
  const {
    id,
    name,
    icon = '📝',
    color,
    strength,
    currentStreak = 0,
    bestStreak = 0,
    completed: completedProp = false,
    atRisk = false,
    disabled = false,
    onPress,
    onLongPress,
    onEdit,
    onDelete,
    style,
    entranceVariant = 'widthExpansion',
    entranceDelay = 0,
    triggerEntrance: shouldTriggerEntrance = true,
    onEntranceComplete,
  } = props;

  const theme = useAppTheme();
  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const strengthFillWidth = useSharedValue(strength);
  const [showFloatingXP, setShowFloatingXP] = React.useState(false);
  const [xpPosition, setXPPosition] = React.useState({ x: 0, y: 0 });
  const [isToggling, setIsToggling] = React.useState(false);

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

  useEffect(() => {
    strengthFillWidth.value = withSpring(strength, {
      damping: 15,
      stiffness: 100,
    });
  }, [strength]);
  useEffect(() => {
    animations.checkmarkScale.value = completed ? 1 : 0;
    animations.checkmarkRotate.value = completed ? 360 : 0;
  }, [completed]);

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${strengthFillWidth.value}%`,
  }));
  const accentColor = color || theme.custom.colors.primary[500];

  return (
    <View style={[styles.container, style]}>
      <SwipeActions
        actionsAnimatedStyle={animations.actionsAnimatedStyle}
        name={name}
        translateX={translateX}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength`}
          accessibilityRole='button'
          accessibilityState={{ checked: completed, disabled }}
          style={[
            styles.card,
            {
              backgroundColor: getBackgroundColor(completed, atRisk, theme),
              borderRadius: theme.custom.borderRadius.large,
            },
            disabled && styles.disabled,
            entrance.cardStyle,
            animations.cardAnimatedStyle,
          ]}
        >
          <StrengthFillBackground
            borderRadius={theme.custom.borderRadius.large}
            strengthColor={getStrengthColor(strength, theme)}
            strengthFillStyle={strengthFillStyle}
          />
          <Animated.View
            style={[
              styles.accentBar,
              {
                backgroundColor: accentColor,
                borderRadius: theme.custom.borderRadius.large,
              },
              entrance.accentStyle,
            ]}
          />
          <HabitCardContent
            atRisk={atRisk}
            bestStreak={bestStreak}
            checkmarkAnimatedStyle={animations.checkmarkAnimatedStyle}
            completed={completed}
            currentStreak={currentStreak}
            entranceContentStyle={entrance.contentStyle}
            icon={icon}
            name={name}
            rippleAnimatedStyle={animations.rippleAnimatedStyle}
            strength={strength}
            theme={theme}
          />
        </Animated.View>
      </GestureDetector>
      {showFloatingXP && (
        <FloatingXPText
          startPosition={xpPosition}
          value={10}
          onComplete={() => setShowFloatingXP(false)}
        />
      )}
    </View>
  );
}

export default HabitCard;
