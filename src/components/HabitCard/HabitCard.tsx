/**
 * HabitCard Component - Display individual habit with tracking and animations
 */

import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import FloatingXPText from '../FloatingXPText/FloatingXPText';
import { useHabitCard } from './useHabitCard';
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
    name,
    icon = '📝',
    strength,
    currentStreak = 0,
    bestStreak = 0,
    atRisk = false,
    disabled = false,
    onEdit,
    onDelete,
    style,
  } = props;

  const habit = useHabitCard(props);

  return (
    <View style={[styles.container, style]}>
      <SwipeActions
        actionsAnimatedStyle={habit.animations.actionsAnimatedStyle}
        name={name}
        translateX={habit.translateX}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <GestureDetector gesture={habit.composedGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength`}
          accessibilityRole='button'
          accessibilityState={{ checked: habit.completed, disabled }}
          style={[
            styles.card,
            {
              backgroundColor: habit.backgroundColor,
              borderRadius: habit.borderRadius,
            },
            disabled && styles.disabled,
            habit.entrance.cardStyle,
            habit.animations.cardAnimatedStyle,
          ]}
        >
          <StrengthFillBackground
            borderRadius={habit.borderRadius}
            strengthColor={habit.strengthColor}
            strengthFillStyle={habit.strengthFillStyle}
          />
          <Animated.View
            style={[
              styles.accentBar,
              {
                backgroundColor: habit.accentColor,
                borderRadius: habit.borderRadius,
              },
              habit.entrance.accentStyle,
            ]}
          />
          <HabitCardContent
            atRisk={atRisk}
            bestStreak={bestStreak}
            checkmarkAnimatedStyle={habit.animations.checkmarkAnimatedStyle}
            completed={habit.completed}
            currentStreak={currentStreak}
            entranceContentStyle={habit.entrance.contentStyle}
            icon={icon}
            name={name}
            rippleAnimatedStyle={habit.animations.rippleAnimatedStyle}
            strength={strength}
            theme={habit.theme}
          />
        </Animated.View>
      </GestureDetector>
      {habit.showFloatingXP && (
        <FloatingXPText
          startPosition={habit.xpPosition}
          value={10}
          onComplete={() => habit.setShowFloatingXP(false)}
        />
      )}
    </View>
  );
}

export default HabitCard;
