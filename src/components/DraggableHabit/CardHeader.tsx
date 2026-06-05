/* eslint-disable max-lines */
/**
 * CardHeader — Top row of a habit card: icon (with pulse), title, phase tag, chevron.
 *
 * Uses a 5-column grid where the icon occupies column 1 and the title overlay
 * spans columns 2–5 via absolute positioning (see {@link TITLE_OVERLAY_STYLE}).
 * Optionally shows "Best: N days" subtitle when the best streak exceeds current.
 */

import React from 'react';
import { View, Text } from 'react-native';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { PhaseTag } from '../PhaseTag';
import { colors as themeColorTokens } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { getIconBackground } from './colorUtils';
import type { CardColors, Habit } from './types';
import { CardDetailsPill } from './CardDetailsPill';
import { getIconContainerStyle } from './CardHeader.styles';

interface CardHeaderProps {
  accentColor: string;
  bestStreak: number;
  colors: CardColors;
  emoji: string;
  enableChevronNudge?: boolean;
  habit: Habit;
  highContrastMode: boolean;
  iconPulse: SharedValue<number>;
  isCompactMode?: boolean;
  isPaused: boolean;
  name: string;
  reduceMotionPreference: boolean;
  showHabitStrengthPercentage: boolean;
  streak: number;
}

export function CardHeader({
  accentColor,
  bestStreak,
  colors,
  emoji,
  enableChevronNudge = false,
  habit,
  highContrastMode,
  iconPulse,
  isCompactMode,
  isPaused,
  name,
  reduceMotionPreference,
  showHabitStrengthPercentage,
  streak,
}: CardHeaderProps) {
  const iconPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconPulse.value }],
  }));
  const { colors: themeColors } = useThemeColors();
  const iconBg = getIconBackground(
    accentColor,
    highContrastMode,
    colors.iconContainer
  );
  const showBestStreak =
    !isCompactMode &&
    bestStreak > 0 &&
    bestStreak > streak &&
    !showHabitStrengthPercentage;

  return (
    <View
      className={`${isCompactMode ? 'mb-2' : 'mb-3'} flex-row items-start px-3`}
    >
      <View className='flex-1 items-center pt-0.5'>
        <ReAnimated.View style={iconPulseStyle}>
          <View
            className={`${isCompactMode ? 'h-7 w-7' : 'h-9 w-9'} items-center justify-center rounded-xl`}
            style={getIconContainerStyle(iconBg, accentColor, highContrastMode)}
          >
            <Text
              className={
                isCompactMode
                  ? 'text-lg leading-[22px]'
                  : 'text-2xl leading-[26px]'
              }
            >
              {emoji}
            </Text>
          </View>
        </ReAnimated.View>
      </View>
      <View style={{ flex: 4, paddingLeft: 8, paddingRight: 12 }}>
        <View className='flex-row items-center gap-2'>
          <Text
            className={`shrink ${isCompactMode ? 'text-base font-semibold leading-[20px]' : 'text-base font-bold leading-[22px]'}`}
            ellipsizeMode='tail'
            numberOfLines={2}
            style={{ color: colors.primaryText, letterSpacing: -0.3 }}
          >
            {name || habit.name}
          </Text>
          {habit.preferredTime ? (
            <PhaseTag compact preferredTime={habit.preferredTime} />
          ) : null}
          {isPaused ? (
            <View
              className='rounded-full px-2 py-0.5'
              style={{ backgroundColor: themeColorTokens.premium[400] }}
            >
              <Text className='text-xs font-semibold text-white'>Paused</Text>
            </View>
          ) : null}
          <CardDetailsPill
            accentColor={accentColor}
            enableChevronNudge={enableChevronNudge}
            highContrastMode={highContrastMode}
            isCompactMode={isCompactMode}
            reduceMotionPreference={reduceMotionPreference}
          />
        </View>
        {showBestStreak ? (
          <Text
            className='mt-0.5 text-sm font-medium'
            style={{ color: themeColors.text.tertiary }}
          >
            Best: {bestStreak} days
          </Text>
        ) : null}
      </View>
    </View>
  );
}
