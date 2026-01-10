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
    <View className='flex-row items-center gap-3 rounded-lg bg-rose-50 p-3'>
      <View className='h-10 w-10 items-center justify-center rounded-full bg-rose-100'>
        <AlertCircle className='text-rose-500' size={18} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-medium text-rose-700'>
          Playback Error
        </Text>
        <Text className='text-xs text-rose-600'>
          {errorMessage || 'Unable to play audio'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Retry playback'
        accessibilityRole='button'
        className='rounded-lg bg-rose-200 px-3 py-1.5'
        onPress={onRetry}
      >
        <Text className='text-xs font-medium text-rose-700'>Retry</Text>
      </Pressable>
    </View>
  );
}
