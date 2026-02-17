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
  SwipeGripLines,
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
    habit,
  } = props;

  const habitData = useHabitCard(props);
  const { colors: themeColors } = useThemeColors();
  const { focusStyle, focusHandlers } = useFocusRing({ disabled });

  return (
    <View style={[styles.container, style]}>
      <SwipeActions
        actionsAnimatedStyle={habitData.animations.actionsAnimatedStyle}
        name={name}
        translateX={habitData.translateX}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <GestureDetector gesture={habitData.composedGesture}>
        <Animated.View
          accessible
          accessibilityHint='Tap to toggle completion. Swipe left to reveal edit and delete actions.'
          accessibilityLabel={`${name} habit, ${Math.round(strength)}% strength${habitData.completed ? ', completed' : ''}`}
          accessibilityRole='button'
          accessibilityState={{ checked: habitData.completed, disabled }}
          testID='home-habit-toggle'
          style={[
            styles.card,
            {
              backgroundColor: habitData.backgroundColor,
              borderColor: themeColors.cardBorder,
              borderRadius: habitData.borderRadius,
            },
            disabled && styles.disabled,
            habitData.entrance.cardStyle,
            habitData.animations.cardAnimatedStyle,
            focusStyle,
          ]}
          {...focusHandlers}
        >
          <StrengthFillBackground
            isDark={habitData.isDark}
            strengthColor={habitData.strengthColor}
            strengthFillStyle={habitData.strengthFillStyle}
          />
          <SuccessShimmer active={habitData.showConfetti} />
          <Animated.View
            style={[
              styles.accentBar,
              {
                backgroundColor: habitData.accentColor,
                borderRadius: habitData.borderRadius,
              },
              habitData.entrance.accentStyle,
            ]}
          />
          <HabitCardContent
            atRisk={atRisk}
            bestStreak={habitData.bestStreak}
            chainRotate={habitData.animations.chainRotate}
            chainScale={habitData.animations.chainScale}
            checkmarkAnimatedStyle={habitData.animations.checkmarkAnimatedStyle}
            completed={habitData.completed}
            completionIcon={completionIcon}
            currentStreak={habitData.currentStreak}
            entranceContentStyle={habitData.entrance.contentStyle as AnimatedStyle}
            hasPendingOfflineOps={habitData.hasPendingOfflineOps}
            icon={icon}
            name={name}
            rippleAnimatedStyle={habitData.animations.rippleAnimatedStyle}
            strength={strength}
            theme={habitData.theme}
            habit={habit}
          />
          <SwipeGripLines />
        </Animated.View>
      </GestureDetector>
      {habitData.showFloatingXP && (
        <FloatingXPText
          startPosition={habitData.xpPosition}
          value={10}
          onComplete={() => habitData.setShowFloatingXP(false)}
        />
      )}
      <ConfettiBurst
        active={habitData.showConfetti}
        onComplete={() => habitData.setShowConfetti(false)}
      />
      <CompletionToast
        habitName={name}
        icon={icon}
        streak={habitData.currentStreak + 1}
        visible={habitData.showCompletionToast}
        onDismiss={() => habitData.setShowCompletionToast(false)}
      />
    </View>
  );
}

export const HabitCard = memo(HabitCardComponent);
export default HabitCard;
