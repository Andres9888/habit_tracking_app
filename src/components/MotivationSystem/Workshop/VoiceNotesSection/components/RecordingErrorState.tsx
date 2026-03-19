/**
 * RecordingErrorState - Error state UI for recording failures
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface RecordingErrorStateProps {
  errorMessage: string | null;
  onTryAgain: () => void;
}

export function RecordingErrorState({ errorMessage, onTryAgain }: RecordingErrorStateProps) {
  const { colors } = useThemeColors();

  return (
    <View className='items-center py-4'>
      <View className='flex-row items-center gap-2'>
        <AlertCircle color={colors.status.error} size={16} />
        <Text className='text-sm' style={{ color: colors.status.errorText }}>
          {errorMessage || 'Recording failed. Please try again.'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Try recording again'
        accessibilityRole='button'
        className='mt-2 rounded-lg px-4 py-2'
        style={{ backgroundColor: colors.status.successLight }}
        onPress={onTryAgain}
      >
        <Text className='text-sm font-medium' style={{ color: colors.status.successText }}>Try Again</Text>
      </Pressable>
    </View>
  );
}
