/**
 * CardHeader — Top row of a habit card: icon (with pulse), title, phase tag, chevron.
 *
 * Uses a 5-column grid where the icon occupies column 1 and the title overlay
 * spans columns 2–5 via absolute positioning (see {@link TITLE_OVERLAY_STYLE}).
 * Optionally shows "Best: N days" subtitle when the best streak exceeds current.
 */

import React from 'react';
import { Animated, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { PhaseTag } from '../PhaseTag';
import { useThemeColors } from '../../theme/ThemeContext';
import { getIconBackground } from './colorUtils';
import type { CardColors, Habit } from './types';
import {
  getIconContainerStyle,
  TITLE_OVERLAY_STYLE,
  getChevronColor,
} from './CardHeader.styles';

interface CardHeaderProps {
  accentColor: string;
  bestStreak: number;
  colors: CardColors;
  emoji: string;
  habit: Habit;
  highContrastMode: boolean;
  iconPulse: Animated.Value;
  name: string;
  showHabitStrengthPercentage: boolean;
  streak: number;
}

export function CardHeader({
  accentColor,
  bestStreak,
  colors,
  emoji,
  habit,
  highContrastMode,
  iconPulse,
  name,
  showHabitStrengthPercentage,
  streak,
}: CardHeaderProps) {
  const { colors: themeColors } = useThemeColors();
  const iconBg = getIconBackground(
    accentColor,
    highContrastMode,
    colors.iconContainer
  );
  const showBestStreak =
    bestStreak > 0 && bestStreak > streak && !showHabitStrengthPercentage;

  return (
    <View className='relative mb-3 flex-row items-center justify-between px-3'>
      <View className='flex-1 items-center'>
        <Animated.View style={{ transform: [{ scale: iconPulse }] }}>
          <View
            className='h-9 w-9 items-center justify-center rounded-xl'
            style={getIconContainerStyle(iconBg, accentColor, highContrastMode)}
          >
            <Text className='text-[22px] leading-[26px]'>{emoji}</Text>
          </View>
        </Animated.View>
      </View>
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      <View style={TITLE_OVERLAY_STYLE}>
        <View className='flex-row items-center gap-2'>
          <Text
            className='shrink text-[17px] font-bold leading-[22px]'
            ellipsizeMode='tail'
            numberOfLines={1}
            style={{ color: colors.primaryText, letterSpacing: -0.3 }}
          >
            {name || habit.name}
          </Text>
          {habit.preferredTime && (
            <PhaseTag compact preferredTime={habit.preferredTime} />
          )}
          <View className='ml-auto'>
            <ChevronRight
              color={getChevronColor(highContrastMode)}
              size={18}
              strokeWidth={2}
            />
          </View>
        </View>
        {showBestStreak && (
          <Text
            className='mt-0.5 text-[13px] font-medium'
            style={{ color: themeColors.text.tertiary }}
          >
            Best: {bestStreak} days
          </Text>
        )}
      </View>
    </View>
  );
}
