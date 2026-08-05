/**
 * EmptyMedalSlot - Hint for unearned medals
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MEDALS } from './constants';
import { useThemeColors } from '@/theme/ThemeContext';

interface EmptyMedalSlotProps {
  medalIndex: number;
  keyPrefix?: string;
}

export function EmptyMedalSlot({
  medalIndex,
  keyPrefix = 'empty',
}: EmptyMedalSlotProps) {
  const { colors } = useThemeColors();
  const positionLabel = medalIndex === 1 ? 'Silver' : 'Bronze';

  return (
    <View
      key={`${keyPrefix}-${medalIndex}`}
      accessibilityLabel={`${positionLabel} medal: not yet earned`}
      className='flex-1 items-center rounded-xl border p-2.5'
      style={{ borderColor: colors.gray[100], backgroundColor: colors.gray[50] }}
    >
      <Text className='mb-0.5 text-base opacity-30'>{MEDALS[medalIndex]}</Text>
      <Text className='text-lg font-bold' style={{ color: colors.gray[300] }}>
        -
      </Text>
      <Text className='text-[9px]' style={{ color: colors.gray[300] }}>
        days
      </Text>
    </View>
  );
}
