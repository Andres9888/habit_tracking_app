/**
 * EmptyMedalSlot - Placeholder for unearned medals
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MEDALS } from './constants';
import { useThemeColors } from '../../../theme/ThemeContext';

interface EmptyMedalSlotProps {
  medalIndex: number;
  keyPrefix?: string;
}

export function EmptyMedalSlot({
  medalIndex,
  keyPrefix = 'empty',
}: EmptyMedalSlotProps) {
  const { isDark } = useThemeColors();
  const positionLabel = medalIndex === 1 ? 'Silver' : 'Bronze';

  return (
    <View
      key={`${keyPrefix}-${medalIndex}`}
      accessibilityLabel={`${positionLabel} medal: not yet earned`}
      className='flex-1 items-center rounded-xl border p-2.5'
      style={{
        backgroundColor: isDark ? '#1C1917' : '#fafaf9',
        borderColor: isDark ? '#44403C' : '#f5f5f4',
      }}
    >
      <Text className='mb-0.5 text-base opacity-30'>{MEDALS[medalIndex]}</Text>
      <Text
        className='text-lg font-bold'
        style={{ color: isDark ? '#57534E' : '#d6d3d1' }}
      >
        -
      </Text>
      <Text
        className='text-[9px]'
        style={{ color: isDark ? '#57534E' : '#d6d3d1' }}
      >
        days
      </Text>
    </View>
  );
}
