/**
 * CapturePromptButton - "Capture this feeling" action button
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

import { SPRING_BUTTON } from '../constants';
import type { CapturePromptButtonProps } from '../types';
import { triggerHaptic } from '@/utils/haptics';

export function CapturePromptButton({
  icon,
  label,
  description,
  onPress,
  isPremium = false,
}: CapturePromptButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerHaptic('tap');
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View className='flex-1' style={animatedStyle}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        className='flex-row items-center gap-3 rounded-xl bg-stone-50 p-4'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View className='h-10 w-10 items-center justify-center rounded-lg bg-stone-100'>
          {icon}
        </View>
        <View className='flex-1'>
          <View className='flex-row items-center gap-2'>
            <Text className='font-semibold text-stone-700'>{label}</Text>
            {isPremium && (
              <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                <Text className='text-xs font-medium text-amber-700'>PRO</Text>
              </View>
            )}
          </View>
          <Text className='text-xs text-stone-500'>{description}</Text>
        </View>
        <Sparkles className='text-stone-400' size={16} />
      </Pressable>
    </Animated.View>
  );
}
