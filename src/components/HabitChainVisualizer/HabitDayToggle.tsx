import React from 'react';
import { Animated, Pressable } from 'react-native';
import clsx from 'clsx';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';
import { Check } from 'lucide-react-native';
import type { HabitDayToggleProps } from './types';
import { useHabitDayToggleAnimations } from './useHabitDayToggleAnimations';
import { useHabitDayToggleHandlers } from './useHabitDayToggleHandlers';
import {
  getTodayGlowStyle,
  getCompletedShadowStyle,
  getBackgroundColor,
  getBorderColor,
} from './habitDayToggleStyles';

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
    useHabitDayToggleAnimations({
      completed,
      isToday,
    });

  const { handlePressIn, handlePressOut, handlePress } =
    useHabitDayToggleHandlers({
      buttonScale,
      completed,
      onPress,
    });

  const isCircle = shape === 'circle';
  const borderRadius = isCircle ? 20 : 9;
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
          'h-9 w-9 items-center justify-center',
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
        <Animated.View
          style={{
            opacity: completion,
            transform: [
              {
                scale: completion.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        >
          {completionIcon === 'checkbox' ? (
            <Check color='#ffffff' size={20} strokeWidth={2.25} />
          ) : (
            <ChainLinkIcon color='#ffffff' size={20} variant='stroke' />
          )}
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
};
