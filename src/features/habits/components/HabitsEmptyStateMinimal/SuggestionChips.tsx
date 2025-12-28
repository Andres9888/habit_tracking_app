/**
 * SuggestionChips - Tappable habit suggestion pills
 *
 * Features:
 * - Flex wrap layout with centered chips
 * - Selection state with emerald highlight
 * - Hover/press animations
 * - Haptic feedback on selection
 * - Staggered entrance animation (50ms between each chip)
 */

import { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import {
  CHIP_STAGGER,
  CHIP_TRANSFORMS,
  ENTRANCE_DELAYS,
  SPRING_CONFIGS,
} from './animations';
import {
  BORDER_RADIUS,
  COLORS,
  SUGGESTION_CHIPS,
  TOUCH_TARGETS,
} from './constants';
import type { SuggestionChip, SuggestionChipsProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  /** Stagger delay for entrance animation (ms) */
  staggerDelay: number;
}

/**
 * Individual suggestion chip with press animations
 *
 * Animation behavior (per spec):
 * - Entrance: fade in + slide up with stagger delay
 * - Hover (onPressIn): translateY -2px, scale 1.05
 * - Press (onPress): triggers selection, brief scale down
 * - Release (onPressOut): animate back to rest state
 */
function Chip({ chip, isSelected, onPress, staggerDelay }: ChipProps) {
  const { triggerSelection } = useHapticFeedback();
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Entrance animation values
  const entranceOpacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    shouldReduceMotion ? 0 : CHIP_STAGGER.translateY
  );

  // Calculate total entrance delay: base chips delay + individual stagger
  const totalEntranceDelay = ENTRANCE_DELAYS.chips + staggerDelay;

  // Trigger entrance animation on mount
  useEffect(() => {
    if (shouldReduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }

    // Fade in with ease-out timing
    entranceOpacity.value = withDelay(
      totalEntranceDelay,
      withTiming(1, {
        duration: CHIP_STAGGER.duration,
        easing: Easing.out(Easing.ease),
      })
    );

    // Slide up with ease-out timing
    entranceTranslateY.value = withDelay(
      totalEntranceDelay,
      withTiming(0, {
        duration: CHIP_STAGGER.duration,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [
    entranceOpacity,
    entranceTranslateY,
    shouldReduceMotion,
    totalEntranceDelay,
  ]);

  // Update selection progress when prop changes
  if (
    (isSelected && selectionProgress.value === 0) ||
    (!isSelected && selectionProgress.value === 1)
  ) {
    selectionProgress.value = shouldReduceMotion
      ? isSelected
        ? 1
        : 0
      : withSpring(isSelected ? 1 : 0, SPRING_CONFIGS.chipPress);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    // Using emerald-700 (#047857) for WCAG AA contrast (5.21:1 with white text)
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

    // Entrance opacity
    opacity: entranceOpacity.value,

    // Shadow increases on hover
    shadowOpacity: shadowOpacity.value,

    // Combine entrance translateY with interaction translateY
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

  // Hover state: lift up, scale up, increase shadow
  const handlePressIn = useCallback(() => {
    if (shouldReduceMotion) return;
    translateY.value = withSpring(
      CHIP_TRANSFORMS.hoverTranslateY,
      SPRING_CONFIGS.chipHover
    );
    scale.value = withSpring(
      CHIP_TRANSFORMS.hoverScale,
      SPRING_CONFIGS.chipHover
    );
    shadowOpacity.value = withSpring(0.15, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  // Release: animate back to rest state
  const handlePressOut = useCallback(() => {
    if (shouldReduceMotion) return;
    scale.value = withSpring(
      CHIP_TRANSFORMS.selectedScale,
      SPRING_CONFIGS.chipPress
    );
    translateY.value = withSpring(0, SPRING_CONFIGS.chipHover);
    shadowOpacity.value = withSpring(0, SPRING_CONFIGS.chipHover);
  }, [scale, shadowOpacity, shouldReduceMotion, translateY]);

  // Selection: haptic feedback + callback
  const handlePress = useCallback(() => {
    triggerSelection();
    // Brief press feedback (scale down then back up)
    if (!shouldReduceMotion) {
      scale.value = withSpring(
        CHIP_TRANSFORMS.pressScale,
        SPRING_CONFIGS.chipPress
      );
    }
    onPress();
  }, [onPress, scale, shouldReduceMotion, triggerSelection]);

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
          gap: 6,
          minHeight: TOUCH_TARGETS.chipHeight,
          paddingHorizontal: 16,

          paddingVertical: 10,
          // Base shadow properties - subtle (opacity animates on hover)
          shadowColor: '#000000',
          shadowOffset: { height: 1, width: 0 },
          shadowRadius: 2,
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
 *
 * Stagger delays per spec:
 * - Row 1 (Water, Walk, Write): 0ms, 50ms, 100ms
 * - Row 2 (Breathe, Read): 150ms, 200ms
 * - Row 3 (Stretch): 250ms
 */
export function SuggestionChips({
  selectedIndex,
  onSelect,
}: SuggestionChipsProps) {
  // Split chips into rows: 3, 2, 1
  const row1 = SUGGESTION_CHIPS.slice(0, 3); // Water, Walk, Write
  const row2 = SUGGESTION_CHIPS.slice(3, 5); // Breathe, Read
  const row3 = SUGGESTION_CHIPS.slice(5, 6); // Stretch

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* Row 1: 3 chips - delays 0, 50, 100ms */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row1.map((chip, i) => (
          <Chip
            key={chip.label}
            chip={chip}
            index={i}
            isSelected={selectedIndex === i}
            staggerDelay={i * CHIP_STAGGER.delay}
            onPress={() => onSelect(i, chip)}
          />
        ))}
      </View>
      {/* Row 2: 2 chips - delays 150, 200ms */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row2.map((chip, i) => {
          const index = i + 3;
          // Continue stagger from row 1 (indices 3, 4)
          const staggerIndex = index;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              staggerDelay={staggerIndex * CHIP_STAGGER.delay}
              onPress={() => onSelect(index, chip)}
            />
          );
        })}
      </View>
      {/* Row 3: 1 chip - delay 250ms */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row3.map((chip, i) => {
          const index = i + 5;
          // Continue stagger from row 2 (index 5)
          const staggerIndex = index;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              staggerDelay={staggerIndex * CHIP_STAGGER.delay}
              onPress={() => onSelect(index, chip)}
            />
          );
        })}
      </View>
    </View>
  );
}
