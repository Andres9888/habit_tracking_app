/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * HabitCard Component - Display individual habit with tracking and animations
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 * ACCESSIBILITY: Focus state support added per UI audit (2026-02-07)
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import FloatingXPText from '../FloatingXPText/FloatingXPText';
import { CompletionToast } from '../CompletionToast';
import { SuccessShimmer } from '../animations/SuccessShimmer';
import { useThemeColors } from '../../theme/ThemeContext';
import { useFocusRing } from '../../utils/accessibility';
import { useHabitCard } from './useHabitCard';
import { styles } from './HabitCard.styles';
import type { HabitCardProps } from './HabitCard.types';
import {
  SwipeActions,
  StrengthFillBackground,
  HabitCardContent,
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
  const { colors: themeColors } = useThemeColors();
  const { focusStyle, focusHandlers } = useFocusRing({ disabled });

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
        <View collapsable={false}>
          <Animated.View
            accessible
            accessibilityHint='Tap to toggle completion. Swipe left to reveal edit and delete actions.'
            accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength${habit.completed ? ', completed' : ''}${atRisk ? ', at risk' : ''}`}
            accessibilityRole='button'
            accessibilityState={{ checked: habit.completed, disabled }}
            testID='home-habit-toggle'
            style={[
              styles.card,
              {
                backgroundColor: habit.backgroundColor,
                borderColor: themeColors.cardBorder,
                borderRadius: habit.borderRadius,
              },
              disabled && styles.disabled,
              habit.entrance.cardStyle,
              habit.animations.cardAnimatedStyle,
              focusStyle,
            ]}
            {...focusHandlers}
          >
            <StrengthFillBackground
              isDark={habit.isDark}
              strengthColor={habit.strengthColor}
              strengthFillStyle={habit.strengthFillStyle}
            />
            <SuccessShimmer active={habit.showConfetti} />
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
              entranceContentStyle={
                habit.entrance.contentStyle as AnimatedStyle
              }
              hasPendingOfflineOps={habit.hasPendingOfflineOps}
              icon={icon}
              name={name}
              rippleAnimatedStyle={habit.animations.rippleAnimatedStyle}
              strength={strength}
              theme={habit.theme}
            />
          </Animated.View>
        </View>
      </GestureDetector>
      {habit.showFloatingXP ? <FloatingXPText
          startPosition={habit.xpPosition}
          value={10}
          onComplete={() => habit.setShowFloatingXP(false)}
        /> : null}
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
