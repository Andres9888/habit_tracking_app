/**
 * EmptyImageCell Component - Add button hint for empty grid slots
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SPRING_BUTTON } from '../../../animations';
import { IMAGE_SIZE } from './types';

interface EmptyImageCellProps {
  index: number;
  onPress?: () => void;
  isLoading?: boolean;
}

export function EmptyImageCell({
  index,
  onPress,
  isLoading,
}: EmptyImageCellProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_BUTTON);
  }, [scale]);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityLabel={`Add image to slot ${index + 1}`}
        accessibilityRole='button'
        className='items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50'
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isLoading ? (
          <ActivityIndicator color='#d946ef' size='small' />
        ) : (
          <View className='items-center gap-1'>
            <View className='h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100'>
              <Plus className='text-fuchsia-500' size={iconSizes.medium} />
            </View>
            <Text className='text-xs font-medium text-fuchsia-500'>
              Add Image
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
