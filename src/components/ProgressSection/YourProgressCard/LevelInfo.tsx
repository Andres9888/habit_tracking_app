import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { LevelConfig } from '../types';
import { TrendIndicator } from './TrendIndicator';

interface LevelInfoProps {
  level: LevelConfig;
  nextLevel: LevelConfig | null;
  weeklyChange: number;
  clampedStrength: number;
}

export function LevelInfo({
  level,
  nextLevel,
  weeklyChange,
  clampedStrength,
}: LevelInfoProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='ml-4 flex-1'>
      <View className='mb-1 flex-row items-center gap-2'>
        <View
          className='rounded-full px-2.5 py-0.5'
          style={{ backgroundColor: level.colorLight }}
        >
          <Text
            className='text-xs font-semibold'
            style={{ color: level.color }}
          >
            {level.label}
          </Text>
        </View>
        <TrendIndicator weeklyChange={weeklyChange} />
      </View>

      <Text className='mb-2 text-xs' style={{ color: themeColors.text.secondary }}>{level.description}</Text>

      {nextLevel ? <Text className='text-[10px]' style={{ color: themeColors.text.tertiary }}>
          {Math.round(nextLevel.minThreshold - clampedStrength)}% to{' '}
          {nextLevel.emoji} {nextLevel.label}
        </Text> : null}
    </View>
  );
}
