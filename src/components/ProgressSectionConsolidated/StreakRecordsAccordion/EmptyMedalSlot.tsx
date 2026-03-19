/**
 * EmptyMedalSlot - Hint for unearned medals
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MEDALS } from './constants';

interface EmptyMedalSlotProps {
  medalIndex: number;
  keyPrefix?: string;
}

export function EmptyMedalSlot({
  medalIndex,
  keyPrefix = 'empty',
}: EmptyMedalSlotProps) {
  const positionLabel = medalIndex === 1 ? 'Silver' : 'Bronze';

  return (
    <View
      key={`${keyPrefix}-${medalIndex}`}
      accessibilityLabel={`${positionLabel} medal: not yet earned`}
      className='flex-1 items-center rounded-xl border border-stone-100 p-2.5'
      style={{ backgroundColor: '#fafaf9' }}
    >
      <Text className='mb-0.5 text-base opacity-30'>{MEDALS[medalIndex]}</Text>
      <Text className='text-lg font-bold' style={{ color: '#d6d3d1' }}>
        -
      </Text>
      <Text className='text-[9px]' style={{ color: '#d6d3d1' }}>
        days
      </Text>
    </View>
  );
}
