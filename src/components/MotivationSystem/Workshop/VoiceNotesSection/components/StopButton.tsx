/**
 * StopButton - Stop and save recording button
 */
import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Square } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface StopButtonProps {
  onStopRecording: () => void;
}

export function StopButton({ onStopRecording }: StopButtonProps) {
  const { colors } = useThemeColors();

  const handleStopPress = useCallback(() => {
    triggerHaptic('heavy');
    onStopRecording();
  }, [onStopRecording]);

  return (
    <Pressable
      accessibilityLabel='Stop and save recording'
      accessibilityRole='button'
      className='h-12 w-12 items-center justify-center rounded-full'
      style={{ backgroundColor: colors.status.error }}
      onPress={handleStopPress}
    >
      <Square color='white' fill='white' size={20} />
    </Pressable>
  );
}
