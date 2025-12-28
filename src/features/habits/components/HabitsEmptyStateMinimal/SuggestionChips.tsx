/**
 * SuggestionChips - Time-aware tappable habit suggestion pills
 *
 * Features:
 * - Time-based smart suggestions (morning/afternoon/evening/night)
 * - Contextual label showing time period
 * - Subtle time-period border tint
 * - Selection state with emerald highlight
 * - Hover/press animations
 * - Haptic feedback on selection
 * - Staggered entrance animation (50ms between each chip)
 */

import { useCallback, useEffect, useMemo } from 'react';
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
  getChipSuggestionsForTime,
  getChipSuggestionsLabel,
  getTimeOfDay,
  getTimePeriodTint,
} from './chipSuggestions';
import { BORDER_RADIUS, COLORS, TOUCH_TARGETS } from './constants';
import type { SuggestionChip, SuggestionChipsProps, TimePeriod } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChipProps {
  chip: SuggestionChip;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  /** Stagger delay for entrance animation (ms) */
  staggerDelay: number;
  /** Time period for accessibility context */
  timePeriod: TimePeriod;
  /** Subtle border tint color for time-period styling */
  tintColor: string;
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
function Chip({
  chip,
  isSelected,
  onPress,
  staggerDelay,
  timePeriod,
  tintColor,
}: ChipProps) {
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

    // Subtle time-period tint when unselected, emerald when selected
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [tintColor, '#047857']
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
      accessibilityHint={`Adds ${chip.fullName} as your new habit`}
      accessibilityLabel={`Select ${chip.fullName}, ${timePeriod} suggestion`}
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
 * Time-aware pyramid layout of suggestion chips (3-2 formation for 5 chips)
 *
 * Stagger delays per spec:
 * - Row 1 (3 chips): 0ms, 50ms, 100ms
 * - Row 2 (2 chips): 150ms, 200ms
 *
 * Time-based behavior:
 * - Auto-detects current time period on mount
 * - Shows contextual label (e.g., "Suggested for morning")
 * - Chips have subtle time-period border tint
 */
export function SuggestionChips({
  selectedIndex,
  onSelect,
  timePeriod: timePeriodProp,
  showTimeLabel = true,
}: SuggestionChipsProps) {
  // Determine time period (use prop or auto-detect)
  const currentTimePeriod = useMemo(() => {
    return timePeriodProp ?? getTimeOfDay();
  }, [timePeriodProp]);

  // Get suggestions and styling for current time period
  const suggestions = useMemo(
    () => getChipSuggestionsForTime(currentTimePeriod),
    [currentTimePeriod]
  );
  const timeLabel = useMemo(
    () => getChipSuggestionsLabel(currentTimePeriod),
    [currentTimePeriod]
  );
  const tintColor = useMemo(
    () => getTimePeriodTint(currentTimePeriod),
    [currentTimePeriod]
  );

  // Split chips into rows: 3, 2 (for 5 chips)
  const row1 = suggestions.slice(0, 3);
  const row2 = suggestions.slice(3, 5);

  return (
    <View
      accessible
      accessibilityLabel={`${timeLabel}. ${suggestions.length} habit suggestions.`}
      style={{ alignItems: 'center', gap: 8 }}
    >
      {/* Time context label */}
      {showTimeLabel && (
        <Text
          style={{
            color: COLORS.stone500,
            fontSize: 13,
            fontWeight: '500',
            letterSpacing: 0.3,
            marginBottom: 4,
          }}
        >
          {timeLabel}
        </Text>
      )}

      {/* Row 1: 3 chips - delays 0, 50, 100ms */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row1.map((chip, i) => (
          <Chip
            key={chip.label}
            chip={chip}
            index={i}
            isSelected={selectedIndex === i}
            staggerDelay={i * CHIP_STAGGER.delay}
            timePeriod={currentTimePeriod}
            tintColor={tintColor}
            onPress={() => onSelect(i, chip)}
          />
        ))}
      </View>

      {/* Row 2: 2 chips - delays 150, 200ms */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {row2.map((chip, i) => {
          const index = i + 3;
          return (
            <Chip
              key={chip.label}
              chip={chip}
              index={index}
              isSelected={selectedIndex === index}
              staggerDelay={index * CHIP_STAGGER.delay}
              timePeriod={currentTimePeriod}
              tintColor={tintColor}
              onPress={() => onSelect(index, chip)}
            />
          );
        })}
      </View>
    </View>
  );
}
