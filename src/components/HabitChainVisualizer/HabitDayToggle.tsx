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
  getOuterFrame,
  MISSED_BG,
  MISSED_BORDER,
} from './habitDayToggleStyles';
import { HabitDayToggleContent } from './HabitDayToggleContent';
import { getMaterialTier } from './materialTier';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HabitDayToggle: React.FC<HabitDayToggleProps> = ({
  accentColor,
  accessibilityHint,
  accessibilityLabel,
  completionIcon,
  completed,
  strengthPercent,
  dateString,
  disabled,
  isToday,
  missed = false,
  onPress,
  shape,
}) => {
  const { buttonScale, combinedScale, completion, flashActive, forgeFlash } =
    useHabitDayToggleAnimations({ completed, isToday, dateString });
  const { handlePressIn, handlePressOut, handlePress } =
    useHabitDayToggleHandlers({ buttonScale, completed, onPress });

  const strength = strengthPercent ?? 0;
  const tier = getMaterialTier(strength);
  const tierAnim = useAnimatedTier(strength);
  const borderRadius = shape === 'circle' ? 22 : 10;
  const tierBackground = getBackgroundColor(completed, accentColor, tier);
  const tierBorder = getBorderColor(completed, isToday, accentColor, tier);
  const staticBackground = missed ? MISSED_BG : tierBackground;
  const staticBorder = missed ? MISSED_BORDER : tierBorder;

  const { cellStyle, shadowStyle } = useHabitDayToggleTierStyles({
    tierAnim,
    accentColor,
    completed,
    missed,
    isToday,
    showCompletedShadow: completed && !missed,
    staticBackground,
    staticBorder,
  });

  const outerFrame = getOuterFrame({
    borderRadius,
    completed,
    missed,
    staticBackground,
    staticBorder,
    tierName: tier.name,
  });

  return (
    <Animated.View
      style={isToday ? getTodayGlowStyle(borderRadius) : undefined}
    >
      {/* cellStyle stays attached in every state: detaching an animated style
          leaves its natively-set props stale, so the worklet owns the reset. */}
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
            completed={completed}
            missed={missed}
            flashActive={flashActive}
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
