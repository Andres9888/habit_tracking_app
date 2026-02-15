/**
 * ReadLetterFooter Component
 * Footer for the read letter modal with done button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReadLetterFooterProps {
  isLocked: boolean;
  onClose: () => void;
}

export function ReadLetterFooter({ isLocked, onClose }: ReadLetterFooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className='border-t border-stone-100 px-4 pt-4' style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
      <Pressable
        accessibilityLabel='Close and return'
        accessibilityRole='button'
        className='flex-row items-center justify-center gap-2 rounded-xl bg-violet-500 py-4'
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
