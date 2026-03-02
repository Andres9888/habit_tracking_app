/**
 * ImageSourceOption Component
 * Reusable option button for camera or library selection
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ImageSourceOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accessibilityLabel: string;
  onPress: () => void;
  onClose: () => void;
}

export function ImageSourceOption({
  icon: Icon,
  title,
  description,
  accessibilityLabel,
  onPress,
  onClose,
}: ImageSourceOptionProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, springs.button);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, springs.button);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-xl border border-stone-200 p-4'
      style={animatedStyle}
      onPress={() => {
        triggerHaptic('tap');
        onPress();
        onClose();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
        <Icon className='text-fuchsia-500' size={20} />
      </View>
      <View className='flex-1'>
        <Text className='font-medium text-stone-800'>{title}</Text>
        <Text className='text-xs text-stone-500'>{description}</Text>
      </View>
    </AnimatedPressable>
  );
}
