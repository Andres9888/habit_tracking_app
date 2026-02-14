/**
 * CaptureSection - "Capture This Feeling" section with voice/letter options
 * Uses theme-aware colors for dark mode support.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Mic, Mail } from 'lucide-react-native';

import { useThemeColors } from '../../../../../theme/ThemeContext';
import { CapturePromptButton } from './CapturePromptButton';

interface CaptureSectionProps {
  onRecordVoice: () => void;
  onWriteLetter: () => void;
}

export function CaptureSection({
  onRecordVoice,
  onWriteLetter,
}: CaptureSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mt-4'>
      <Text
        className='mb-3 text-sm font-semibold'
        style={{ color: colors.text.secondary }}
      >
        Capture This Feeling
      </Text>
      <View className='gap-3'>
        <CapturePromptButton
          isPremium
          description='Record how you feel right now'
          icon={<Mic color={colors.text.tertiary} size={20} />}
          label='Record Voice'
          onPress={onRecordVoice}
        />
        <CapturePromptButton
          isPremium
          description='Write to your future self'
          icon={<Mail color={colors.text.tertiary} size={20} />}
          label='Write Letter'
          onPress={onWriteLetter}
        />
      </View>
    </View>
  );
}
