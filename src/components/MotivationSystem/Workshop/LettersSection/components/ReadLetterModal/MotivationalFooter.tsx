/**
 * MotivationalFooter Component
 * Encouraging message at the bottom of the letter
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface MotivationalFooterProps {
  showContent: boolean;
  contentAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function MotivationalFooter({
  showContent,
  contentAnimatedStyle,
}: MotivationalFooterProps) {
  return (
    <Animated.View
      className='mt-8'
      style={showContent ? contentAnimatedStyle : { opacity: 0 }}
    >
      <View className='flex-row items-start gap-3 rounded-xl p-4'>
        <LinearGradient
          colors={['#f5f3ff', '#fff1f2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className='absolute inset-0 rounded-xl'
        />
        <View className='h-8 w-8 items-center justify-center rounded-full bg-violet-100'>
          <Heart className='text-violet-500' fill='#8b5cf6' size={16} />
        </View>
        <View className='flex-1'>
          <Text className='text-sm font-medium text-violet-700'>
            This is the voice that made the commitment
          </Text>
          <Text className='mt-1 text-xs text-stone-500'>
            The person who wrote this believed in your ability to persist. Honor
            that belief.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
