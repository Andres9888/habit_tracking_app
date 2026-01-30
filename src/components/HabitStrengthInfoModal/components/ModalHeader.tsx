/**
 * ModalHeader Component for HabitStrengthInfoModal
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <Animated.View
      className='mb-4 flex-row items-center justify-between'
      entering={FadeIn.duration(300)}
    >
      <View className='flex-row items-center gap-3'>
        <View className='h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100'>
          <Ionicons color='#6366F1' name='fitness-outline' size={24} />
        </View>
        <View>
          <Text className='text-xl font-bold text-stone-800'>
            Habit Strength
          </Text>
          <Text className='text-sm text-stone-500'>
            How we measure your progress
          </Text>
        </View>
      </View>
      <Pressable
        className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
        onPress={onClose}
      >
        <Ionicons color='#78716C' name='close' size={20} />
      </Pressable>
    </Animated.View>
  );
}

export default ModalHeader;
