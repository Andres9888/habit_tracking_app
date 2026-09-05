/**
 * SuggestionEmojiCell Component
 * Memoized emoji cell with press animation for AI suggestions
 */

import React, { memo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressAnimation } from '@/hooks/usePressAnimation';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';

const PressableBase = Animated.createAnimatedComponent(Pressable);

interface SuggestionEmojiCellProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

export const SuggestionEmojiCell = memo(
  ({ emoji, isSelected, onPress }: SuggestionEmojiCellProps) => {
    // 0.92 rather than the app default 0.97: a 56pt tile makes a 3% shrink
    // invisible.
    const { animatedStyle, pressHandlers } = usePressAnimation({
      pressScale: 0.92,
    });

    return (
      <PressableBase
        accessibilityLabel={`Suggested emoji ${emoji}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={[
          suggestionCellStyles.cell,
          isSelected && suggestionCellStyles.cellSelected,
          animatedStyle,
        ]}
        onPress={onPress}
        {...pressHandlers}
      >
        <Text style={suggestionCellStyles.emojiText}>{emoji}</Text>
      </PressableBase>
    );
  }
);

SuggestionEmojiCell.displayName = 'SuggestionEmojiCell';

export const suggestionCellStyles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.large,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  cellSelected: {
    backgroundColor: colors.secondary[100],
    borderColor: colors.secondary[500],
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 32,
  },
});
