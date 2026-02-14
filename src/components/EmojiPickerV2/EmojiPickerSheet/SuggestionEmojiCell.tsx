/**
 * SuggestionEmojiCell Component
 * Memoized emoji cell with press animation for AI suggestions
 * Theme-aware with dark mode support
 */

import React, { memo, useCallback } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import type { SemanticColors } from '../../../theme/darkColors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SuggestionEmojiCellProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  themeColors: SemanticColors;
}

export const SuggestionEmojiCell = memo(
  ({ emoji, isSelected, onPress, themeColors }: SuggestionEmojiCellProps) => {
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

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        accessibilityLabel={`Suggested emoji ${emoji}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={[
          suggestionCellStyles.cell,
          { backgroundColor: themeColors.surface },
          isSelected && [
            suggestionCellStyles.cellSelected,
            { backgroundColor: colors.secondary[100], borderColor: colors.secondary[500] },
          ],
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={suggestionCellStyles.emojiText}>{emoji}</Text>
      </AnimatedPressable>
    );
  }
);

SuggestionEmojiCell.displayName = 'SuggestionEmojiCell';

export const suggestionCellStyles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  cellSelected: {
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 32,
  },
});
