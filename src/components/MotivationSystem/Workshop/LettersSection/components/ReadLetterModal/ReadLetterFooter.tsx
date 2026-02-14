/**
 * ReadLetterFooter Component
 * Footer for the read letter modal with done button
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

interface ReadLetterFooterProps {
  isLocked: boolean;
  onClose: () => void;
}

export function ReadLetterFooter({ isLocked, onClose }: ReadLetterFooterProps) {
  return (
    <View className='border-t border-stone-100 px-4 pb-10 pt-4'>
      <Pressable
        accessibilityLabel='Close and return'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl bg-violet-500 py-4'
        onPress={() => {
          triggerHaptic('toggle');
          onClose();
        }}
      >
        <Check className='text-white' size={20} />
        <Text className='text-base font-semibold text-white'>
          {isLocked ? 'Close' : 'Done Reading'}
        </Text>
      </Pressable>
    </View>
  );
}
