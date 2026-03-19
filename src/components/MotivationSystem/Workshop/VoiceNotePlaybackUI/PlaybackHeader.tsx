/**
 * PlaybackHeader Component
 * Header with label and Day 1 badge for voice note playback
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { PlaybackHeaderProps } from './types';

export function PlaybackHeader({ label, isDay1 }: PlaybackHeaderProps) {
  const { colors } = useThemeColors();

  if (!label && !isDay1) {
    return null;
  }

  return (
    <View className='mb-3 flex-row items-center gap-2'>
      <Text
        className='flex-1 text-sm font-medium'
        style={{ color: colors.text.primary }}
        numberOfLines={1}
      >
        {label || 'Voice Note'}
      </Text>
      {isDay1 ? <View className='rounded-full px-2 py-0.5' style={{ backgroundColor: colors.status.warningLight }}>
          <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>Day 1</Text>
        </View> : null}
    </View>
  );
}
