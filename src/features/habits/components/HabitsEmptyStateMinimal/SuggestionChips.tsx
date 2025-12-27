/**
 * SuggestionChips - Tappable habit suggestion pills
 *
 * Features:
 * - Flex wrap layout with centered chips
 * - Selection state with emerald highlight
 * - Hover/press animations
 * - Haptic feedback on selection
 */

import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { CHIP_TRANSFORMS, SPRING_CONFIGS } from './animations';
import { BORDER_RADIUS, COLORS, SUGGESTION_CHIPS, TOUCH_TARGETS } from './constants';
import type { SuggestionChip, SuggestionChipsProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Individual suggestion chip with press animations
 */
function Chip({ chip, isSelected, onPress }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Update selection progress when prop changes
  if ((isSelected && selectionProgress.value === 0) || (!isSelected && selectionProgress.value === 1)) {
    selectionProgress.value = withSpring(isSelected ? 1 : 0, SPRING_CONFIGS.chipPress);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#ffffff', COLORS.emerald500]
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.stone200, COLORS.emerald500]
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.stone700, '#ffffff']
    ),
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(CHIP_TRANSFORMS.pressScale, SPRING_CONFIGS.chipPress);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(CHIP_TRANSFORMS.selectedScale, SPRING_CONFIGS.chipPress);
    translateY.value = withSpring(0, SPRING_CONFIGS.chipHover);
  }, [scale, translateY]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPress();
  }, [onPress, triggerSelection]);

  return (
    <AnimatedPressable
      accessibilityLabel={`Select ${chip.fullName}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: BORDER_RADIUS.chip,
          borderWidth: 1,
          minHeight: TOUCH_TARGETS.chipHeight,
        },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={{ fontSize: 18 }}>{chip.emoji}</Text>
      <Animated.Text
        style={[
          textStyle,
          {
            fontSize: 14,
            fontWeight: '600',
          },
        ]}
      >
        {chip.label}
      </Animated.Text>
    </AnimatedPressable>
  );
}

/**
 * Grid of suggestion chips for quick habit selection
 */
export function SuggestionChips({ selectedIndex, onSelect }: SuggestionChipsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {SUGGESTION_CHIPS.map((chip, index) => (
        <Chip
          key={chip.label}
          chip={chip}
          index={index}
          isSelected={selectedIndex === index}
          onPress={() => onSelect(index, chip)}
        />
      ))}
    </View>
  );
}
