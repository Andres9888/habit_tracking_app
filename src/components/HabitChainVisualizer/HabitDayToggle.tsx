import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import clsx from 'clsx';
import { Unlink } from 'lucide-react-native';
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
import { getMaterialTier } from './materialTier';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FORGE_FLASH_COLOR = '#FBBF24'; // amber-400 — brief glow on completion
const MISSED_BG = '#FEF2F2'; // rose-50
const MISSED_BORDER = '#DC2626'; // red-600

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

  const tier = getMaterialTier(strengthPercent ?? 0);
  const isCircle = shape === 'circle';
  const borderRadius = isCircle ? 22 : 10;
  const tierBackground = getBackgroundColor(
    completed,
    accentColor,
    highContrastMode,
    tier
  );
  const tierBorder = getBorderColor(
    completed,
    isToday,
    accentColor,
    highContrastMode,
    tier
  );
  const isLegendary = tier.name === 'legendary';
  const backgroundColor = missed ? MISSED_BG : tierBackground;
  const borderColor = missed ? MISSED_BORDER : tierBorder;
  const borderWidth = missed || !completed || isLegendary ? 2 : 0;

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
          (!completed || missed) && 'border-2'
        )}
        disabled={disabled}
        style={{
          backgroundColor,
          borderColor,
          borderRadius,
          borderStyle: missed ? 'dashed' : 'solid',
          borderWidth,
          opacity: disabled ? 0.5 : 1,
          overflow: 'hidden',
          transform: [{ scale: combinedScale }],
          ...(completed &&
            !missed &&
            !highContrastMode &&
            getCompletedShadowStyle(isToday, accentColor, tier)),
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          pointerEvents='none'
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: FORGE_FLASH_COLOR, opacity: forgeFlash },
          ]}
        />
        {missed ? (
          <View
            pointerEvents='none'
            style={StyleSheet.absoluteFillObject}
            className='items-center justify-center'
          >
            <Unlink color={MISSED_BORDER} size={18} strokeWidth={2.5} />
          </View>
        ) : (
          <AnimatedCompletionIcon
            completion={completion}
            completionIcon={completionIcon}
            iconColor={tier.iconColor}
          />
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};
