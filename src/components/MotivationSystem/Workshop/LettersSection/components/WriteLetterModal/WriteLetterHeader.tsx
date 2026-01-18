/**
 * WriteLetterHeader Component
 * Modal header with title and close button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mail, X } from 'lucide-react-native';
import type { WriteLetterStep } from './WriteLetterModal.types';

interface WriteLetterHeaderProps {
  step: WriteLetterStep;
  onClose: () => void;
}

export function WriteLetterHeader({ step, onClose }: WriteLetterHeaderProps) {
  const isWriteStep = step === 'write';

  return (
    <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
      <View className='flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
          <Mail className='text-violet-600' size={20} />
        </View>
        <View>
          <Text className='text-lg font-bold text-stone-800'>
            {isWriteStep ? 'Write Your Letter' : 'Schedule Delivery'}
          </Text>
          <Text className='text-xs text-stone-500'>
            {isWriteStep
              ? 'A message to your future self'
              : 'When should this letter unlock?'}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
        onPress={onClose}
      >
        <X className='text-stone-500' size={20} />
      </Pressable>
    </View>
  );
}
