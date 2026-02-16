/**
 * WriteLetterHeader Component
 * Modal header with title and close button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mail, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
import type { WriteLetterStep } from './WriteLetterModal.types';

interface WriteLetterHeaderProps {
  step: WriteLetterStep;
  onClose: () => void;
}

export function WriteLetterHeader({ step, onClose }: WriteLetterHeaderProps) {
  const isWriteStep = step === 'write';
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between border-b px-4 pb-4 pt-6' style={{ borderColor: colors.border }}>
      <View className='flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
          <Mail className='text-violet-600' size={20} />
        </View>
        <View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
            {isWriteStep ? 'Write Your Letter' : 'Schedule Delivery'}
          </Text>
          <Text className='text-xs' style={{ color: colors.text.tertiary }}>
            {isWriteStep
              ? 'A message to your future self'
              : 'When should this letter unlock?'}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.gray[200] }}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={20} />
      </Pressable>
    </View>
  );
}
