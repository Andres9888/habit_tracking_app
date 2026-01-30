import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { BORDER_RADIUS, COLORS, TOUCH_TARGETS } from '../constants';
import type { SuggestionChip } from '../types';
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
      ['#ffffff', '#047857']
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.stone200, '#047857']
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
      [COLORS.stone700, '#ffffff']
    ),
  }));

  const handlePress = useCallback(() => {
    triggerSelection();
    animatePressScale();
    onPress();
  }, [onPress, animatePressScale, triggerSelection]);

  return (
    <AnimatedPressable
      accessibilityLabel={`Select ${chip.fullName}`}
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
          gap: 4,
          minHeight: TOUCH_TARGETS.chipHeight,
          paddingHorizontal: 10,
          paddingVertical: 8,
          shadowColor: '#000000',
          shadowOffset: { height: 1, width: 0 },
          shadowRadius: 2,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={{ fontSize: 15 }}>{chip.emoji}</Text>
      <Animated.Text style={[textStyle, { fontSize: 13, fontWeight: '600' }]}>
        {chip.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}
