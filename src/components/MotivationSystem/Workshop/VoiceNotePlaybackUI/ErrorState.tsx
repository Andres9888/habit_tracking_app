/**
 * ErrorState Component
 * Error display with retry button for audio playback failures
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import type { ErrorStateProps } from './types';

export function ErrorState({ errorMessage, onRetry }: ErrorStateProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center gap-3 rounded-lg p-3' style={{ backgroundColor: colors.status.errorLight }}>
      <View className='h-10 w-10 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.errorLight }}>
        <AlertCircle color={colors.status.error} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-medium' style={{ color: colors.status.errorText }}>
          Playback Error
        </Text>
        <Text className='text-xs' style={{ color: colors.status.error }}>
          {errorMessage || 'Unable to play audio'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Retry playback'
        accessibilityRole='button'
        className='rounded-lg px-3 py-1.5'
        style={{ backgroundColor: colors.status.errorLight }}
        onPress={onRetry}
      >
        <Text className='text-xs font-medium' style={{ color: colors.status.errorText }}>Retry</Text>
      </Pressable>
    </View>
  );
}
