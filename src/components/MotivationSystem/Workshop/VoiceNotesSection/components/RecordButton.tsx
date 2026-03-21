/**
 * RecordButton Component
 * Initial recording button shown when not actively recording
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mic } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface RecordButtonProps {
  canRecord: boolean;
  hasVoiceNotes: boolean;
  onStartRecording: () => void;
}

export function RecordButton({
  canRecord,
  hasVoiceNotes,
  onStartRecording,
}: RecordButtonProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mt-4 items-center'>
      <Pressable
        accessibilityLabel='Start recording'
        accessibilityRole='button'
        className='flex-row items-center gap-2 rounded-full px-4 py-2'
        style={{ backgroundColor: canRecord ? colors.status.success : colors.border }}
        onPress={onStartRecording}
      >
        <Mic className='text-white' size={16} />
        <Text className='font-medium text-white'>
          {hasVoiceNotes ? 'New Recording' : 'Record Your Day 1'}
        </Text>
      </Pressable>
    </View>
  );
}
