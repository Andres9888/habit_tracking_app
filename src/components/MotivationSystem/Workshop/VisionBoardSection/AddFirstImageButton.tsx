/**
 * AddFirstImageButton Component
 * Call-to-action button for adding the first vision board image
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ImagePlus } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AddFirstImageButtonProps {
  onPress: () => void;
}

export function AddFirstImageButton({ onPress }: AddFirstImageButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 18, stiffness: 150 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 150 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className='mt-4 items-center'>
      <AnimatedPressable
        accessibilityLabel='Add your first image'
        accessibilityRole='button'
        className='flex-row items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2'
        style={animatedStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <ImagePlus className='text-white' size={16} />
        <Text className='font-medium text-white'>Add Your First Image</Text>
      </AnimatedPressable>
    </View>
  );
}
