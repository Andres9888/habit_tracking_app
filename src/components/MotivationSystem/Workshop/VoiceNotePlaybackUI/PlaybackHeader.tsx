/**
 * PlaybackHeader Component
 * Header with label and Day 1 badge for voice note playback
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { PlaybackHeaderProps } from './types';

export function PlaybackHeader({ label, isDay1 }: PlaybackHeaderProps) {
  if (!label && !isDay1) {
    return null;
  }

  return (
    <View className='mb-3 flex-row items-center gap-2'>
      <Text
        className='flex-1 text-sm font-medium text-stone-700 dark:text-stone-200'
        numberOfLines={1}
      >
        {label || 'Voice Note'}
      </Text>
      {isDay1 && (
        <View className='rounded-full bg-amber-100 px-2 py-0.5 dark:bg-amber-900/40'>
          <Text className='text-xs font-medium text-amber-700 dark:text-amber-300'>Day 1</Text>
        </View>
      )}
    </View>
  );
}
