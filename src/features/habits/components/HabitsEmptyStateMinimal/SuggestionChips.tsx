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
  useReducedMotion,
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
 *
 * Animation behavior (per spec):
 * - Hover (onPressIn): translateY -2px, scale 1.05
 * - Press (onPress): triggers selection, brief scale down
 * - Release (onPressOut): animate back to rest state
 */
function Chip({ chip, isSelected, onPress }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Update selection progress when prop changes
  if ((isSelected && selectionProgress.value === 0) || (!isSelected && selectionProgress.value === 1)) {
    selectionProgress.value = shouldReduceMotion
      ? isSelected ? 1 : 0
      : withSpring(isSelected ? 1 : 0, SPRING_CONFIGS.chipPress);
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
    // Shadow increases on hover
    shadowOpacity: shadowOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.stone700, '#ffffff']
    ),
  }));

  // Hover state: lift up, scale up, increase shadow
  const handlePressIn = useCallback(() => {
    if (shouldReduceMotion) return;
    translateY.value = withSpring(CHIP_TRANSFORMS.hoverTranslateY, SPRING_CONFIGS.chipHover);
    scale.value = withSpring(CHIP_TRANSFORMS.hoverScale, SPRING_CONFIGS.chipHover);
    shadowOpacity.value = withSpring(0.15, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  // Release: animate back to rest state
  const handlePressOut = useCallback(() => {
    if (shouldReduceMotion) return;
    scale.value = withSpring(CHIP_TRANSFORMS.selectedScale, SPRING_CONFIGS.chipPress);
    translateY.value = withSpring(0, SPRING_CONFIGS.chipHover);
    shadowOpacity.value = withSpring(0, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  // Selection: haptic feedback + callback
  const handlePress = useCallback(() => {
    triggerSelection();
    // Brief press feedback (scale down then back up)
    if (!shouldReduceMotion) {
      scale.value = withSpring(CHIP_TRANSFORMS.pressScale, SPRING_CONFIGS.chipPress);
    }
    onPress();
  }, [onPress, scale, shouldReduceMotion, triggerSelection]);

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
          // Base shadow properties - subtle (opacity animates on hover)
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
          elevation: 1,
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
            fontSize: 15,
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
 * Pyramid layout of suggestion chips (3-2-1 formation)
 */
export function SuggestionChips({ selectedIndex, onSelect }: SuggestionChipsProps) {
  // Split chips into rows: 3, 2, 1
  const row1 = SUGGESTION_CHIPS.slice(0, 3); // Water, Walk, Write
  const row2 = SUGGESTION_CHIPS.slice(3, 5); // Breathe, Read
  const row3 = SUGGESTION_CHIPS.slice(5, 6); // Stretch

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* Row 1: 3 chips */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {row1.map((chip, i) => (
          <Chip
            key={chip.label}
            chip={chip}
            index={i}
            isSelected={selectedIndex === i}
            onPress={() => onSelect(i, chip)}
          />
        ))}
      </View>
      {/* Row 2: 2 chips */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {row2.map((chip, i) => {
          const index = i + 3;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              onPress={() => onSelect(index, chip)}
            />
          );
        })}
      </View>
      {/* Row 3: 1 chip */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {row3.map((chip, i) => {
          const index = i + 5;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              onPress={() => onSelect(index, chip)}
            />
          );
        })}
      </View>
    </View>
  );
}
