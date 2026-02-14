/**
 * EmptyMedalSlot - Placeholder for unearned medals
 * Polished: dark mode support, consistent border radius
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
      className='flex-1 items-center rounded-2xl border border-stone-100 p-2.5 dark:border-stone-700 dark:bg-stone-800'
      style={{
        backgroundColor: undefined,
      }}
    >
      <Text className='mb-0.5 text-base opacity-30'>{MEDALS[medalIndex]}</Text>
      <Text className='text-lg font-bold text-stone-300 dark:text-stone-600'>
        -
      </Text>
      <Text className='text-[9px] text-stone-300 dark:text-stone-600'>
        days
      </Text>
    </View>
  );
}
