import React from 'react';
import { Animated, View, Text } from 'react-native';
import { ChevronRight, Pause } from 'lucide-react-native';
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
  const iconBg = getIconBackground(
    accentColor,
    highContrastMode,
    colors.iconContainer
  );
  const showBestStreak =
    bestStreak > 0 && bestStreak > streak && !showHabitStrengthPercentage;

  const isPaused = habit.paused === true;

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
            style={{ 
              color: isPaused ? colors.secondaryText : colors.primaryText, 
              letterSpacing: -0.3,
              opacity: isPaused ? 0.6 : 1,
            }}
          >
            {name || habit.name}
          </Text>
          {isPaused ? (
            <View 
              className='flex-row items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5'
            >
              <Pause size={10} color='#6b7280' />
              <Text className='text-[10px] font-medium text-gray-500'>Paused</Text>
            </View>
          ) : (
            habit.preferredTime && (
              <PhaseTag compact preferredTime={habit.preferredTime} />
            )
          )}
          <View className='ml-auto'>
            <ChevronRight
              color={getChevronColor(highContrastMode)}
              size={18}
              strokeWidth={2}
            />
          </View>
        </View>
        {showBestStreak && !isPaused && (
          <Text
            className='mt-0.5 text-[13px] font-medium'
            style={{ color: '#a8a29e' }}
          >
            Best: {bestStreak} days
          </Text>
        )}
        {isPaused && (
          <Text
            className='mt-0.5 text-[13px] font-medium'
            style={{ color: '#9ca3af' }}
          >
            Paused {habit.pausedAt ? formatPauseDate(habit.pausedAt) : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatPauseDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}
