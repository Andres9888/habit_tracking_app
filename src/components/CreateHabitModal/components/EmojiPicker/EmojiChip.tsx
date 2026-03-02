/**
 * EmojiChip Component
 * Individual emoji chip with press animation and green ring when selected
 * Scale 1.0 → 1.08 → 1.0 with spring animation (200ms total)
 * V11 Task 8: Respects reduced motion preference
 */

import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { EmojiChipProps } from './types';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function EmojiChipComponent({
  emoji,
  isSelected,
  onPress,
  reduceMotion,
}: EmojiChipProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    // Quick press down to 97% scale
    scale.value = withTiming(0.97, { duration: 50 });
  }, [scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    'worklet';
    if (reduceMotion) {
      // No animation in reduced motion mode
      scale.value = 1;
      return;
    }
    // Celebratory scale 1.0 → 1.08 → 1.0 with spring
    // Total duration: ~200ms for snappy feel
    scale.value = withSequence(
      withTiming(1.08, { duration: 100 }),
      withSpring(1, springs.standard)
    );
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    // Fixed 64px container to prevent layout shift during scale animation
    <View
      style={{
        alignItems: 'center',
        height: 64,
        justifyContent: 'center',
        width: 64,
      }}
    >
      <AnimatedPressable
        accessibilityLabel={`Select emoji ${emoji}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        className={`h-14 w-14 items-center justify-center rounded-2xl ${
          isSelected
            ? 'border-2 border-[#059669] bg-[#D1FAE5]'
            : 'border border-stone-200 bg-stone-100'
        }`}
        style={[
          animatedStyle,
          isSelected && {
            elevation: 4,
            shadowColor: '#059669',
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='text-3xl'>{emoji}</Text>
      </AnimatedPressable>
    </View>
  );
}

export const EmojiChip = memo(EmojiChipComponent);
