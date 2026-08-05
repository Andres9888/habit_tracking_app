import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { LEVEL_EMOJIS } from './constants';

interface ProgressBarProps {
  levelProgress: number;
  levelColor: string;
}

export function ProgressBar({ levelProgress, levelColor }: ProgressBarProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='mb-3'>
      <View className='h-2 overflow-hidden rounded-full' style={{ backgroundColor: themeColors.background }}>
        <Animated.View
          className='h-full rounded-full'
          style={{ backgroundColor: levelColor, width: `${levelProgress}%` }}
        />
      </View>
      <View className='mt-1.5 flex-row justify-between'>
        {LEVEL_EMOJIS.map((emoji, i) => (
          <Text key={i} className='text-[10px]'>
            {emoji}
          </Text>
        ))}
      </View>
    </View>
  );
}
