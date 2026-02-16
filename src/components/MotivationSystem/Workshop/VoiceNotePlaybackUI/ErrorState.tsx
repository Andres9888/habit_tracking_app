/**
 * ErrorState Component
 * Error display with retry button for audio playback failures
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import type { ErrorStateProps } from './types';

export function ErrorState({ errorMessage, onRetry }: ErrorStateProps) {
  return (
    <View className='flex-row items-center gap-3 rounded-lg bg-rose-50 p-3 dark:bg-rose-900/30'>
      <View className='h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50'>
        <AlertCircle className='text-rose-500 dark:text-rose-400' size={18} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-medium text-rose-700 dark:text-rose-300'>
          Playback Error
        </Text>
        <Text className='text-xs text-rose-600 dark:text-rose-400'>
          {errorMessage || 'Unable to play audio'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Retry playback'
        accessibilityRole='button'
        accessibilityHint='Attempt to play the audio again'
        className='rounded-lg bg-rose-200 px-3 py-1.5 dark:bg-rose-900/60'
        onPress={onRetry}
      >
        <Text className='text-xs font-medium text-rose-700 dark:text-rose-300'>Retry</Text>
      </Pressable>
    </View>
  );
}
