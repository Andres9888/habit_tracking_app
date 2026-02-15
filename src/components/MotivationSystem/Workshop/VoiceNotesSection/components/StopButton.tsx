/**
 * StopButton - Stop and save recording button
 */

import React, { useCallback } from 'react';
import { Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import { Square } from 'lucide-react-native';

interface StopButtonProps {
  onStopRecording: () => void;
}

export function StopButton({ onStopRecording }: StopButtonProps) {
  const handleStopPress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onStopRecording();
  }, [onStopRecording]);

  return (
    <Pressable
      accessibilityLabel='Stop and save recording'
      accessibilityRole='button'
      className='h-12 w-12 items-center justify-center rounded-full bg-rose-500'
      onPress={handleStopPress}
    >
      <Square className='text-white' fill='white' size={20} />
    </Pressable>
  );
}
