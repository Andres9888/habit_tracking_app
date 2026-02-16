import { memo, useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { styles } from './styles';
import type { EmojiCellProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Memoized emoji cell component with press animation
 * PERF: Accept emoji in onPress to avoid parent creating new handlers per cell
 */
export const EmojiCell = memo(({ emoji, isSelected, onPress }: EmojiCellProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.92, { duration: 50 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 80 }),
      withTiming(1, { duration: 100 })
    );
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress(emoji);
  }, [emoji, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={`Select ${emoji} emoji`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={[styles.emojiCell, isSelected && styles.emojiCellSelected, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </AnimatedPressable>
  );
});

EmojiCell.displayName = 'EmojiCell';
