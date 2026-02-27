import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SPRING_BUTTON } from './constants';
import { triggerHaptic } from '@/utils/haptics';

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

/**
 * QuickAction - Secondary action buttons (Snooze, Just 2 Min)
 */
export function QuickAction({ label, icon, onPress }: QuickActionProps) {
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
        className='flex-row items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-3'
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon}
        <Text className='font-medium text-stone-700'>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
