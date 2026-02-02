/**
 * CaptureSection - "Capture This Feeling" section with voice/letter options
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Mic, Mail } from 'lucide-react-native';

import { CapturePromptButton } from './CapturePromptButton';

interface CaptureSectionProps {
  onRecordVoice?: () => void;
  onWriteLetter?: () => void;
}

export function CaptureSection({
  onRecordVoice,
  onWriteLetter,
}: CaptureSectionProps) {
  return (
    <View className='mt-4'>
      <Text className='mb-3 text-sm font-semibold text-stone-600'>
        Capture This Feeling
      </Text>
      <View className='gap-3'>
        <CapturePromptButton
          isPremium
          description='Record how you feel right now'
          icon={<Mic className='text-stone-500' size={20} />}
          label='Record Voice'
          onPress={onRecordVoice}
        />
        <CapturePromptButton
          isPremium
          description='Write to your future self'
          icon={<Mail className='text-stone-500' size={20} />}
          label='Write Letter'
          onPress={onWriteLetter}
        />
      </View>
    </View>
  );
}
