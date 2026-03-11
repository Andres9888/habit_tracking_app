/* eslint-disable max-lines-per-function */
import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { PhaseTag } from '../PhaseTag';
import { useThemeColors } from '../../theme/ThemeContext';
import { getIconBackground } from './colorUtils';
import type { CardColors, Habit } from './types';
import { getChevronColor, getIconContainerStyle } from './CardHeader.styles';

interface CardHeaderProps {
  accentColor: string; bestStreak: number; colors: CardColors; emoji: string;
  habit: Habit; highContrastMode: boolean; iconPulse: SharedValue<number>;
  isPaused: boolean; name: string; showHabitStrengthPercentage: boolean;
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
  isPaused,
  name,
  showHabitStrengthPercentage,
  streak,
}: CardHeaderProps) {
  const iconPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconPulse.value }],
  }));
  const { colors: themeColors } = useThemeColors();
  const iconBg = getIconBackground(accentColor, highContrastMode, colors.iconContainer);
  const showBestStreak = bestStreak > 0 && bestStreak > streak && !showHabitStrengthPercentage;

  return (
    <View className='mb-3 flex-row items-start gap-3 px-3'>
      <ReAnimated.View style={iconPulseStyle}>
        <View
          className='h-9 w-9 items-center justify-center rounded-xl'
          style={getIconContainerStyle(iconBg, accentColor, highContrastMode)}
        >
          <Text className='text-[22px] leading-[26px]'>{emoji}</Text>
        </View>
      </ReAnimated.View>
      <View className='flex-1' style={{ minHeight: 36, justifyContent: 'center' }}>
        <View className='flex-row items-start gap-2'>
          <Text
            className='shrink text-[17px] font-bold leading-[22px]'
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
              style={{ backgroundColor: '#8b5cf6' }}
            >
              <Text className='text-[11px] font-semibold text-white'>
                Paused
              </Text>
            </View>
          ) : null}
          <View className='ml-auto'>
            <ChevronRight
              color={getChevronColor(highContrastMode)}
              size={18}
              strokeWidth={2}
            />
          </View>
        </View>
        {showBestStreak ? (
          <Text
            className='mt-0.5 text-[13px] font-medium'
            style={{ color: themeColors.text.tertiary }}
          >
            Best: {bestStreak} days
          </Text>
        ) : null}
      </View>
    </View>
  );
}
