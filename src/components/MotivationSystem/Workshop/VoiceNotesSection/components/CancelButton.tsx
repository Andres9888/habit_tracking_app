/**
 * CancelButton - Cancel recording button with confirmation alert
 */
import React, { useCallback } from 'react';
import { Text, Pressable, Alert } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';

interface CancelButtonProps {
  onCancelRecording: () => void;
}

export function CancelButton({ onCancelRecording }: CancelButtonProps) {
  const handleCancelPress = useCallback(() => {
    triggerHaptic('tap');
    Alert.alert(
      'Cancel Recording',
      'Are you sure you want to discard this recording?',
      [
        { style: 'cancel', text: 'Keep Recording' },
        { onPress: onCancelRecording, style: 'destructive', text: 'Discard' },
      ]
    );
  }, [onCancelRecording]);

  return (
    <Pressable
      accessibilityLabel='Cancel recording'
      accessibilityRole='button'
      className='h-12 w-12 items-center justify-center rounded-full bg-stone-100'
      onPress={handleCancelPress}
    >
      <Text className='text-xs font-medium text-stone-500'>Cancel</Text>
    </Pressable>
  );
}
