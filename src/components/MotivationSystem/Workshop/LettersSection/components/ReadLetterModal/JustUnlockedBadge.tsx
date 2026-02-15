/**
 * JustUnlockedBadge Component
 * Animated badge shown when a letter was just unlocked
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { Unlock, Sparkles } from 'lucide-react-native';

interface JustUnlockedBadgeProps {
  sparkleAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function JustUnlockedBadge({
  sparkleAnimatedStyle,
}: JustUnlockedBadgeProps) {
  return (
    <View className='mb-6 items-center'>
      <Animated.View
        className='flex-row items-center gap-2 rounded-full bg-amber-50 px-4 py-2'
        style={[sparkleAnimatedStyle]}
      >
        <Unlock className='text-amber-500' size={16} />
        <Text className='font-semibold text-amber-700'>Just Unlocked!</Text>
        <Sparkles className='text-amber-500' size={16} />
      </Animated.View>
    </View>
  );
}
