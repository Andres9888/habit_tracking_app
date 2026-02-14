/**
 * ReadLetterHeader Component
 * Header for the read letter modal with animated envelope
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { MailOpen, X } from 'lucide-react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface ReadLetterHeaderProps {
  title: string | undefined;
  envelopeAnimatedStyle: AnimatedStyle<ViewStyle>;
  onClose: () => void;
}

export function ReadLetterHeader({
  title,
  envelopeAnimatedStyle,
  onClose,
}: ReadLetterHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 pb-4 pt-14'>
      <View className='flex-1' />
      <View className='flex-row items-center gap-2'>
        <Animated.View style={envelopeAnimatedStyle}>
          <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
            <MailOpen className='text-violet-600' size={24} />
          </View>
        </Animated.View>
        <Text className='text-lg font-bold text-stone-800'>
          {title || 'Letter from Past Self'}
        </Text>
      </View>
      <View className='flex-1 items-end'>
        <Pressable
          accessibilityLabel='Close letter'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
          onPress={() => {
            triggerHaptic('tap');
            onClose();
          }}
        >
          <X className='text-stone-500' size={24} />
        </Pressable>
      </View>
    </View>
  );
}
