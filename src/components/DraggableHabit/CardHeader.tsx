import React from 'react';
import { Animated, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { PhaseTag } from '../PhaseTag';
import { getIconBackground } from './colorUtils';
import type { CardColors, Habit } from './types';

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

  return (
    <View className='relative mb-3 flex-row items-center justify-between px-3'>
      {/* Column 1: emoji centered */}
      <View className='flex-1 items-center'>
        <Animated.View style={{ transform: [{ scale: iconPulse }] }}>
          <View
            className='h-9 w-9 items-center justify-center rounded-xl'
            style={{
              backgroundColor: iconBg,
              borderColor: highContrastMode ? '#111111' : 'rgba(0,0,0,0.04)',
              borderWidth: highContrastMode ? 2 : 1,
              shadowColor: accentColor,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
          >
            <Text className='text-[22px] leading-[26px]'>{emoji}</Text>
          </View>
        </Animated.View>
      </View>
      {/* Grid spacers */}
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      <View className='flex-1' />
      {/* Title overlay */}
      <View
        style={{
          bottom: 0,
          justifyContent: 'center',
          left: '20%',
          paddingLeft: 8,
          paddingRight: 12,
          position: 'absolute',
          right: 12,
          top: 0,
        }}
      >
        <View className='flex-row items-center gap-2'>
          <Text
            className='shrink text-[17px] font-bold leading-[22px]'
            ellipsizeMode='tail'
            numberOfLines={1}
            style={{
              color: colors.primaryText,
              letterSpacing: -0.3,
            }}
          >
            {name || habit.name}
          </Text>
          {habit.preferredTime && (
            <PhaseTag compact preferredTime={habit.preferredTime} />
          )}
          <View className='ml-auto'>
            <ChevronRight
              color={highContrastMode ? '#facc15' : '#a8a29e'}
              size={18}
              strokeWidth={2}
            />
          </View>
        </View>
        {bestStreak > 0 &&
          bestStreak > streak &&
          !showHabitStrengthPercentage && (
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
