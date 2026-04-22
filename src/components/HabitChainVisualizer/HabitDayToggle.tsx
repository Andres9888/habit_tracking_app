import React from 'react';
import { Animated, Pressable } from 'react-native';
import Reanimated from 'react-native-reanimated';
import clsx from 'clsx';
import { useAnimatedTier } from '@/hooks/useAnimatedTier';

import type { HabitDayToggleProps } from './types';
import { useHabitDayToggleAnimations } from './useHabitDayToggleAnimations';
import { useHabitDayToggleHandlers } from './useHabitDayToggleHandlers';
import { useHabitDayToggleTierStyles } from './useHabitDayToggleTierStyles';
import {
  getTodayGlowStyle,
  getBackgroundColor,
  getBorderColor,
} from './habitDayToggleStyles';
import { HabitDayToggleContent } from './HabitDayToggleContent';
import { getMaterialTier } from './materialTier';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MISSED_BG = '#FEF2F2';
const MISSED_BORDER = '#DC2626';

export const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  completed,
  strengthPercent,
  disabled,
  highContrastMode,
  isToday,
  missed = false,
  onPress,
  shape,
}) => {
  const { completion, buttonScale, combinedScale, forgeFlash } =
    useHabitDayToggleAnimations({ completed, isToday });
  const { handlePressIn, handlePressOut, handlePress } =
    useHabitDayToggleHandlers({ buttonScale, completed, onPress });

  const strength = strengthPercent ?? 0;
  const tier = getMaterialTier(strength);
  const tierAnim = useAnimatedTier(strength);
  const borderRadius = shape === 'circle' ? 22 : 10;
  const tierBackground = getBackgroundColor(completed, accentColor, highContrastMode, tier);
  const tierBorder = getBorderColor(completed, isToday, accentColor, highContrastMode, tier);
  const staticBackground = missed ? MISSED_BG : tierBackground;
  const staticBorder = missed ? MISSED_BORDER : tierBorder;
  const borderWidth = missed || !completed || tier.name === 'legendary' ? 2 : 0;
  const showCompletedShadow = completed && !missed && !highContrastMode;

  const { cellStyle, shadowStyle } = useHabitDayToggleTierStyles({
    tierAnim,
    accentColor,
    completed,
    missed,
    isToday,
    showCompletedShadow,
    staticBackground,
    staticBorder,
  });

  const outerFrame = {
    borderRadius,
    borderStyle: (missed ? 'dashed' : 'solid') as 'dashed' | 'solid',
    borderWidth,
    height: 44,
    width: 44,
  };

  return (
    <Animated.View style={isToday ? getTodayGlowStyle(borderRadius) : undefined}>
      <Reanimated.View style={[outerFrame, cellStyle, shadowStyle]}>
        <AnimatedPressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className={clsx('items-center justify-center')}
          disabled={disabled}
          style={{
            borderRadius,
            flex: 1,
            opacity: disabled ? 0.5 : 1,
            overflow: 'hidden',
            transform: [{ scale: combinedScale }],
          }}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <HabitDayToggleContent
            missed={missed}
            forgeFlash={forgeFlash}
            completion={completion}
            completionIcon={completionIcon}
            iconColor={tier.iconColor}
          />
        </AnimatedPressable>
      </Reanimated.View>
    </Animated.View>
  );
};
