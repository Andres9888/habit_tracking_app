/**
 * WriteLetterButton Component
 * CTA button for writing a new letter
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mail } from 'lucide-react-native';

interface WriteLetterButtonProps {
  hasLetters: boolean;
  onPress: () => void;
}

export function WriteLetterButton({
  hasLetters,
  onPress,
}: WriteLetterButtonProps) {
  return (
    <View className='mt-4 items-center'>
      <Pressable
        accessibilityLabel='Write a new letter'
        accessibilityRole='button'
        className='flex-row items-center gap-2 rounded-full bg-violet-500 px-4 py-2'
        onPress={onPress}
      >
        <Mail className='text-white' size={16} />
        <Text className='font-medium text-white'>
          {hasLetters ? 'Write Another' : 'Write Your First Letter'}
        </Text>
      </Pressable>
    </View>
  );
}
