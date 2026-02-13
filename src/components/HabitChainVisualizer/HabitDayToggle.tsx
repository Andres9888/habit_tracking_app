import React from 'react';
import { Animated, Pressable } from 'react-native';
import clsx from 'clsx';
import type { HabitDayToggleProps } from './types';
import { useHabitDayToggleAnimations } from './useHabitDayToggleAnimations';
import { useHabitDayToggleHandlers } from './useHabitDayToggleHandlers';
import {
  getTodayGlowStyle,
  getCompletedShadowStyle,
  getBackgroundColor,
  getBorderColor,
} from './habitDayToggleStyles';
import { AnimatedCompletionIcon } from './AnimatedCompletionIcon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  completed,
  disabled,
  highContrastMode,
  isToday,
  onPress,
  shape,
}) => {
  const { completion, buttonScale, combinedScale } =
    useHabitDayToggleAnimations({ completed, isToday });
  const { handlePressIn, handlePressOut, handlePress } =
    useHabitDayToggleHandlers({ buttonScale, completed, onPress });

  const isCircle = shape === 'circle';
  const borderRadius = isCircle ? 22 : 10;
  const backgroundColor = getBackgroundColor(
    completed,
    accentColor,
    highContrastMode
  );
  const borderColor = getBorderColor(
    completed,
    isToday,
    accentColor,
    highContrastMode
  );

  return (
    <Animated.View
      style={isToday ? getTodayGlowStyle(borderRadius) : undefined}
    >
      <AnimatedPressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        className={clsx(
          'h-11 w-11 items-center justify-center',
          !completed && 'border-2'
        )}
        disabled={disabled}
        style={{
          backgroundColor,
          borderColor,
          borderRadius,
          borderWidth: completed ? 0 : 2,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: combinedScale }],
          ...(completed &&
            !highContrastMode &&
            getCompletedShadowStyle(isToday, accentColor)),
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <AnimatedCompletionIcon
          completion={completion}
          completionIcon={completionIcon}
        />
      </AnimatedPressable>
    </Animated.View>
  );
};
