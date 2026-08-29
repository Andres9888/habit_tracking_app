import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { HabitDayToggleContent } from './HabitDayToggleContent';
import {
  getCellContainerStyle,
  getFrameStyle,
  getPressableStyle,
  getStaticFrameColors,
  getTodayGlowStyle,
} from './habitDayToggleStyles';
import { getMaterialTier } from './materialTier';
import type { HabitDayToggleProps } from './types';
import { useHabitDayToggleAnimations } from './useHabitDayToggleAnimations';
import { useHabitDayToggleHandlers } from './useHabitDayToggleHandlers';
import { useHabitDayToggleTierStyles } from './useHabitDayToggleTierStyles';

const HabitDayToggleComponent: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completed,
  completionIcon,
  dateString,
  disabled,
  isToday,
  missed = false,
  onPress,
  shape,
  strengthPercent,
}) => {
  const animation = useHabitDayToggleAnimations({ completed, dateString, isToday });
  const handlers = useHabitDayToggleHandlers({
    buttonScale: animation.buttonScale,
    onPress,
    reduceMotion: animation.reduceMotion,
  });
  const tier = getMaterialTier(strengthPercent ?? 0);
  const tierAnim = useAnimatedTier(strengthPercent ?? 0);
  const borderRadius = shape === 'circle' ? 22 : 10;
  const frameColors = getStaticFrameColors(isToday, missed);
  const { cellStyle, shadowStyle } = useHabitDayToggleTierStyles({
    accentColor,
    completion: animation.completion,
    isToday,
    missed,
    showCompletedShadow: completed && !missed,
    staticBackground: frameColors.background,
    staticBorder: frameColors.border,
    tierAnim,
  });

  return (
    <View style={isToday ? getTodayGlowStyle(borderRadius) : undefined}>
      <Animated.View
        style={[
          getCellContainerStyle(borderRadius),
          animation.cellScaleStyle,
          shadowStyle,
        ]}
      >
        <Animated.View
          pointerEvents='none'
          style={[
            StyleSheet.absoluteFill,
            getFrameStyle({
              backgroundColor: frameColors.background,
              borderColor: frameColors.border,
              borderRadius,
              missed,
            }),
            cellStyle,
            animation.breathingStyle,
          ]}
        />
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className='items-center justify-center'
          disabled={disabled}
          style={getPressableStyle(borderRadius, disabled)}
          onPress={handlers.handlePress}
          onPressIn={handlers.handlePressIn}
          onPressOut={handlers.handlePressOut}
        >
          <HabitDayToggleContent
            completion={animation.completion}
            completionIcon={completionIcon}
            completionIconMounted={animation.completionIconMounted}
            iconColor={tier.iconColor}
            missed={missed}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export const HabitDayToggle = memo(HabitDayToggleComponent);
