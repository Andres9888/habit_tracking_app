/**
 * DayCell Component
 * Individual day cell in the calendar heatmap
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
  FadeIn,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { CalendarDay } from './utils';
import { getDayAccessibilityLabel } from './utils';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface DayCellProps {
  day: CalendarDay;
  /** Index for staggered animation */
  index: number;
  /** Custom habit color (hex) */
  habitColor?: string;
  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DayCell({ day, index, habitColor, onPress }: DayCellProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  // Today pulse animation - draws attention to complete action
  // Stops pulsing once completed
  const shouldPulse = day.isToday && !day.completed && !reduceMotion;

  useEffect(() => {
    if (!shouldPulse) {
      // Reset pulse values when not pulsing
      pulseScale.value = 1;
      pulseOpacity.value = 0;
      return;
    }

    // Subtle pulse animation: scale ring outward with fading opacity
    // Creates a "breathing" glow effect around today's cell
    const pulseAnimation = withSequence(
      withTiming(1.3, { duration: 1000, easing: Easing.out(Easing.ease) }),
      withTiming(1.3, { duration: 200 }), // Hold briefly
    );

    const opacityAnimation = withSequence(
      withTiming(0.6, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 800, easing: Easing.in(Easing.ease) }),
    );

    // Start with a delay to let the cell fade in first
    pulseScale.value = withDelay(
      500,
      withRepeat(pulseAnimation, -1, false) // Infinite repeat
    );
    pulseOpacity.value = withDelay(
      500,
      withRepeat(opacityAnimation, -1, false)
    );

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
  }, [shouldPulse, pulseScale, pulseOpacity]);

  const handlePressIn = () => {
    if (day.date && !day.isFuture && !day.isBeforeCreation && !reduceMotion) {
      scale.value = withSpring(0.9, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const handlePress = () => {
    if (day.date && onPress && !day.isFuture && !day.isBeforeCreation) {
      onPress(day.date, day.completed);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Staggered animation delay for all cell types - skip if reduceMotion
  const staggerDelay = reduceMotion ? 0 : index * 10;
  const fadeInAnimation = reduceMotion ? undefined : FadeIn.delay(staggerDelay).duration(200);

  // Get accessibility label
  const accessibilityLabel = getDayAccessibilityLabel(day);

  // Empty padding cell
  if (day.date === null) {
    return (
      <Animated.View
        entering={fadeInAnimation}
        className="flex-1 aspect-square"
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      />
    );
  }

  // Before habit creation - don't render or show very dimmed
  if (day.isBeforeCreation) {
    return (
      <Animated.View
        entering={fadeInAnimation}
        className="flex-1 aspect-square items-center justify-center"
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-stone-50">
          <Text className="text-xs text-stone-300" importantForAccessibility="no-hide-descendants">
            {day.dayOfMonth}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Future date
  if (day.isFuture) {
    return (
      <Animated.View
        entering={fadeInAnimation}
        className="flex-1 aspect-square items-center justify-center"
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <View className="h-9 w-9 items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50">
          <Text className="text-xs text-stone-300" importantForAccessibility="no-hide-descendants">
            {day.dayOfMonth}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Determine cell styling based on state
  const getCellStyle = () => {
    if (day.completed) {
      if (day.isToday) {
        // Today + completed
        return 'border-2 border-amber-400';
      }
      // Completed
      return '';
    }
    if (day.isToday) {
      // Today + not completed
      return 'border-2 border-amber-400 bg-amber-50';
    }
    // Not completed (past)
    return 'bg-stone-100';
  };

  const completedBgColor = habitColor || '#10b981'; // emerald-500 default

  return (
    <AnimatedPressable
      entering={fadeInAnimation}
      style={animatedStyle}
      className="flex-1 aspect-square items-center justify-center"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={day.isToday ? 'Today' : 'Tap to view details'}
      accessibilityState={{ selected: day.completed }}
    >
      {/* Pulse ring for today's incomplete cell - draws attention to complete action */}
      {shouldPulse && (
        <Animated.View
          style={pulseRingStyle}
          className="absolute h-9 w-9 rounded-lg border-2 border-amber-400"
          pointerEvents="none"
        />
      )}
      <View
        className={`h-9 w-9 items-center justify-center rounded-lg ${getCellStyle()}`}
        style={day.completed ? { backgroundColor: completedBgColor } : undefined}
      >
        {day.completed ? (
          <Check className="text-white" size={16} strokeWidth={3} />
        ) : (
          <Text
            className={`text-xs font-medium ${
              day.isToday ? 'text-amber-600' : 'text-stone-400'
            }`}
          >
            {day.dayOfMonth}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}

export default DayCell;
