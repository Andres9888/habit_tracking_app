/**
 * CueField Component
 * Individual cue field display with emoji icons
 * Matches mockup: sky-500 icon color, stone-600 label, stone-900 value
 */

import React from 'react';
import { View, Text } from 'react-native';

interface CueFieldProps {
  emoji: string;
  label: string;
  value?: string;
}

export function CueField({ emoji, label, value }: CueFieldProps) {
  return (
    <View className='flex-row items-center gap-2'>
      <Text className='text-sky-500'>{emoji}</Text>
      <Text className='text-xs text-stone-600'>
        {label}:{' '}
        <Text className='font-medium text-stone-900'>{value || '—'}</Text>
      </Text>
    </View>
  );
}
