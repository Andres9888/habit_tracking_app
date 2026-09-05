import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressAnimation } from '@/hooks/usePressAnimation';
import { styles } from './styles';
import type { EmojiCellProps } from './types';

const PressableBase = Animated.createAnimatedComponent(Pressable);

/**
 * Memoized emoji cell component with press animation.
 *
 * `pressScale` is 0.92 rather than the app default 0.97: these tiles are ~44pt,
 * and a 3% shrink on something that small is invisible.
 */
export const EmojiCell = memo(({ emoji, isSelected, onPress }: EmojiCellProps) => {
  const { animatedStyle, pressHandlers } = usePressAnimation({
    pressScale: 0.92,
  });

  return (
    <PressableBase
      accessibilityLabel={`Select ${emoji} emoji`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={[styles.emojiCell, isSelected && styles.emojiCellSelected, animatedStyle]}
      onPress={onPress}
      {...pressHandlers}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </PressableBase>
  );
});

EmojiCell.displayName = 'EmojiCell';
