import React from 'react';
import { Animated, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { PhaseTag } from '../PhaseTag';
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
  isPaused: boolean;
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
  isPaused,
  name,
  showHabitStrengthPercentage,
  streak,
}: CardHeaderProps) {
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
          {isPaused && (
            <View
              className='rounded-full px-2 py-0.5'
              style={{ backgroundColor: '#8b5cf6' }}
            >
              <Text className='text-[11px] font-semibold text-white'>
                Paused
              </Text>
            </View>
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
            style={{ color: '#a8a29e' }}
          >
            Best: {bestStreak} days
          </Text>
        )}
      </View>
    </View>
  );
}
