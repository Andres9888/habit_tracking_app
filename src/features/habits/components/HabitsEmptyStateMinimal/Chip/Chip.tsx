import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { BORDER_RADIUS } from '../constants';
import type { SuggestionChip } from '../types';
import { useEmptyStateColors } from '../useEmptyStateColors';
import { useChipAnimations } from './useChipAnimations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  staggerDelay: number;
}

export function Chip({ chip, isSelected, onPress, staggerDelay }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const colors = useEmptyStateColors();
  const {
    scale,
    translateY,
    shadowOpacity,
    selectionProgress,
    entranceOpacity,
    entranceTranslateY,
    handlePressIn,
    handlePressOut,
    animatePressScale,
  } = useChipAnimations({ isSelected, staggerDelay });

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.chipBackground, colors.chipBackgroundSelected]
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.chipBorder, colors.chipBorderSelected]
    ),
    opacity: entranceOpacity.value,
    shadowOpacity: shadowOpacity.value,
    transform: [
      { translateY: entranceTranslateY.value + translateY.value },
      { scale: scale.value },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.chipText, colors.chipTextSelected]
    ),
  }));

  const handlePress = useCallback(() => {
    triggerSelection();
    animatePressScale();
    onPress();
  }, [onPress, animatePressScale, triggerSelection]);

  return (
    <AnimatedPressable
      accessibilityHint={`Double tap to fill in "${chip.fullName}"`}
      accessibilityLabel={chip.fullName}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          borderRadius: BORDER_RADIUS.chip,
          borderWidth: 1,
          elevation: 1,
          flexDirection: 'row',
          gap: 6,
          height: 40,
          paddingHorizontal: 14,
          shadowColor: colors.chipShadow,
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={{ fontSize: 15 }}>{chip.emoji}</Text>
      <Animated.Text
        style={[
          textStyle,
          {
            fontFamily: fontFamilies.primary.text,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          },
        ]}
      >
        {chip.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}
