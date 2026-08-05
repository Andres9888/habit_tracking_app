/**
 * LevelInfo Component
 *
 * Displays the current level badge, description, and progress to next level.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { TrendIndicator } from '../TrendIndicator';
import { useThemeColors } from '@/theme/ThemeContext';

interface LevelInfoProps {
  currentLevel: {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    emoji: string;
  };
  nextLevel: { emoji: string } | null;
  weeklyChange: number;
  pointsToNext: number;
  progressBarAnimatedStyle: object;
}

export function LevelInfo({
  currentLevel,
  nextLevel,
  weeklyChange,
  pointsToNext,
  progressBarAnimatedStyle,
}: LevelInfoProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-1'>
      <View className='mb-1.5 flex-row items-center gap-2'>
        <View
          className='rounded-full px-3 py-1'
          style={{ backgroundColor: currentLevel.bgColor }}
        >
          <Text
            className='text-sm font-semibold'
            style={{ color: currentLevel.color }}
          >
            {currentLevel.label}
          </Text>
        </View>
        <TrendIndicator weeklyChange={weeklyChange} />
      </View>
      <Text className='mb-1 text-sm' style={{ color: colors.text.secondary }}>
        {currentLevel.description}
      </Text>
      <View className='flex-row items-center gap-1.5'>
        <View className='h-1.5 flex-1 overflow-hidden rounded-full' style={{ backgroundColor: colors.gray[100] }}>
          <Animated.View
            className='h-full rounded-full'
            style={[
              { backgroundColor: currentLevel.color },
              progressBarAnimatedStyle,
            ]}
          />
        </View>
        {nextLevel ? (
          <Text className='whitespace-nowrap text-[10px]' style={{ color: colors.text.tertiary }}>
            {pointsToNext}% to {nextLevel.emoji}
          </Text>
        ) : (
          <Text className='whitespace-nowrap text-[10px]' style={{ color: colors.text.tertiary }}>
            Max level! {currentLevel.emoji}
          </Text>
        )}
      </View>
    </View>
  );
}
