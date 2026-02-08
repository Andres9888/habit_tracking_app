/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * HabitCard Component - Display individual habit with tracking and animations
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 * ACCESSIBILITY: Focus state support added per UI audit (2026-02-07)
 */

import React, { memo, useState, useCallback } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import FloatingXPText from '../FloatingXPText/FloatingXPText';
import { CompletionToast } from '../CompletionToast';
import { useHabitCard } from './useHabitCard';
import { styles } from './HabitCard.styles';
import type { HabitCardProps } from './HabitCard.types';
import {
  SwipeActions,
  StrengthFillBackground,
  HabitCardContent,
  ConfettiBurst,
} from './components';

export type { HabitCardProps } from './HabitCard.types';

function HabitCardComponent(props: HabitCardProps) {
  const {
    name,
    icon = '📝',
    strength,
    atRisk = false,
    disabled = false,
    onEdit,
    onDelete,
    style,
    completionIcon = 'checkbox',
  } = props;

  const habit = useHabitCard(props);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

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
          accessibilityHint='Tap to toggle completion. Swipe left for edit and delete options.'
          accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength${habit.completed ? ', completed' : ''}. Swipe left for actions.`}
          accessibilityRole='button'
          accessibilityState={{ checked: habit.completed, disabled }}
          focusable={!disabled}
          style={[
            styles.card,
            {
              backgroundColor: habit.backgroundColor,
              borderRadius: habit.borderRadius,
            },
            disabled && styles.disabled,
            isFocused && styles.focused,
            habit.entrance.cardStyle,
            habit.animations.cardAnimatedStyle,
          ]}
          onBlur={handleBlur}
          onFocus={handleFocus}
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
            bestStreak={habit.bestStreak}
            chainRotate={habit.animations.chainRotate}
            chainScale={habit.animations.chainScale}
            checkmarkAnimatedStyle={habit.animations.checkmarkAnimatedStyle}
            completed={habit.completed}
            completionIcon={completionIcon}
            currentStreak={habit.currentStreak}
            entranceContentStyle={habit.entrance.contentStyle}
            hasPendingOfflineOps={habit.hasPendingOfflineOps}
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
      <ConfettiBurst
        active={habit.showConfetti}
        onComplete={() => habit.setShowConfetti(false)}
      />
      <CompletionToast
        habitName={name}
        icon={icon}
        streak={habit.currentStreak + 1}
        visible={habit.showCompletionToast}
        onDismiss={() => habit.setShowCompletionToast(false)}
      />
    </View>
  );
}

export const HabitCard = memo(HabitCardComponent);
export default HabitCard;
