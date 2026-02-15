/**
 * EditorHeader Component
 * Header section for the affirmation editor modal
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Sparkles, X } from 'lucide-react-native';

interface EditorHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export function EditorHeader({ isEditing, onClose }: EditorHeaderProps) {
  return (
    <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
      <View className='flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
          <Sparkles className='text-amber-600' size={20} />
        </View>
        <View>
          <Text className='text-lg font-bold text-stone-800'>
            {isEditing ? 'Edit Affirmation' : 'Add Affirmation'}
          </Text>
          <Text className='text-xs text-stone-500'>
            Positive self-talk for daily reinforcement
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={onClose}
      >
        <X className='text-stone-500' size={24} />
      </Pressable>
    </View>
  );
}
