import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { clsx } from 'clsx';

import { SPRING_BUTTON } from '../../../../animations';
import { SPRING_BOUNCY } from '../QuickReflection.constants';
import { triggerHaptic } from '@/utils/haptics';

interface EmojiButtonProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
}

export function EmojiButton({
  emoji,
  label,
  isSelected,
  onPress,
  reduceMotion = false,
}: EmojiButtonProps) {
  const scale = useSharedValue(1);
  const selectionScale = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    selectionScale.value = reduceMotion
      ? isSelected
        ? 1
        : 0
      : isSelected
        ? withSequence(
            withSpring(1.15, SPRING_BOUNCY),
            withSpring(1, SPRING_BUTTON)
          )
        : withTiming(0, { duration: 150 });
  }, [isSelected, reduceMotion, selectionScale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_BUTTON);
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
  const selectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionScale.value,
    transform: [{ scale: selectionScale.value }],
  }));

  return (
    <Pressable
      accessibilityLabel={`${label} emoji`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center'
        style={animatedStyle}
      >
        <Animated.View
          className='absolute h-14 w-14 rounded-full border-2 border-emerald-400 bg-emerald-100'
          style={selectionAnimatedStyle}
        />
        <View
          className={clsx(
            'h-14 w-14 items-center justify-center rounded-full',
            !isSelected && 'bg-stone-100'
          )}
        >
          <Text className='text-3xl'>{emoji}</Text>
        </View>
        <Text
          className={clsx(
            'mt-1 text-xs',
            isSelected ? 'font-medium text-emerald-700' : 'text-stone-500'
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
