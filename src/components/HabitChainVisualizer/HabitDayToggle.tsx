import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { HabitDayToggleContent } from './HabitDayToggleContent';
import { HabitDayToggleFrame } from './HabitDayToggleFrame';
import {
  getCellContainerStyle,
  getPressableStyle,
  getStaticFrameColors,
  getTierFrameColors,
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
  reduceMotionPreference,
  shape,
  strengthPercent,
}) => {
  const animation = useHabitDayToggleAnimations({
    dateString,
    reduceMotionPreference,
  });
  const handlers = useHabitDayToggleHandlers({
    buttonScale: animation.buttonScale,
    onPress,
    reduceMotion: animation.reduceMotion,
  });
  const tier = getMaterialTier(strengthPercent ?? 0);
  const tierAnim = useAnimatedTier(strengthPercent ?? 0);
  const borderRadius = shape === 'circle' ? 22 : 10;
  const showCompletion = completed && !missed;
  const tierColors = getTierFrameColors(tier, accentColor);
  const { cellStyle, shadowStyle } = useHabitDayToggleTierStyles({
    accentColor,
    isToday,
    showCompletedShadow: showCompletion,
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
        <HabitDayToggleFrame
          borderRadius={borderRadius}
          cellStyle={cellStyle}
          completed={showCompletion}
          missed={missed}
          reduceMotion={animation.reduceMotion}
          restingColors={
            showCompletion ? tierColors : getStaticFrameColors(isToday, missed)
          }
          tierColors={tierColors}
        />
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='checkbox'
          accessibilityState={{ checked: completed, disabled }}
          className='items-center justify-center'
          disabled={disabled}
          style={getPressableStyle(borderRadius, disabled)}
          onPress={handlers.handlePress}
          onPressIn={handlers.handlePressIn}
          onPressOut={handlers.handlePressOut}
        >
          <HabitDayToggleContent
            completed={showCompletion}
            completionIcon={completionIcon}
            iconColor={tier.iconColor}
            missed={missed}
            reduceMotion={animation.reduceMotion}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export const HabitDayToggle = memo(HabitDayToggleComponent);
