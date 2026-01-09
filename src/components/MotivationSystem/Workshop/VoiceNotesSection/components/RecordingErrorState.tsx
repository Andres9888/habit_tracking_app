/**
 * RecordingErrorState - Error state UI for recording failures
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface RecordingErrorStateProps {
  errorMessage: string | null;
  onTryAgain: () => void;
}

export function RecordingErrorState({ errorMessage, onTryAgain }: RecordingErrorStateProps) {
  return (
    <View className='items-center py-4'>
      <View className='flex-row items-center gap-2'>
        <AlertCircle className='text-rose-500' size={16} />
        <Text className='text-sm text-rose-600'>
          {errorMessage || 'Recording failed. Please try again.'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Try recording again'
        accessibilityRole='button'
        className='mt-2 rounded-lg bg-teal-100 px-4 py-2'
        onPress={onTryAgain}
      >
        <Text className='text-sm font-medium text-teal-700'>Try Again</Text>
      </Pressable>
    </View>
  );
}
