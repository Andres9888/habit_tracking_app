/**
 * DayCell Component
 * Individual day cell in the calendar heatmap
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { CalendarDay } from './utils';

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

  const handlePressIn = () => {
    if (day.date && !day.isFuture && !day.isBeforeCreation) {
      scale.value = withSpring(0.9, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (day.date && onPress && !day.isFuture && !day.isBeforeCreation) {
      onPress(day.date, day.completed);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Empty padding cell
  if (day.date === null) {
    return <View className="flex-1 aspect-square" />;
  }

  // Before habit creation - don't render or show very dimmed
  if (day.isBeforeCreation) {
    return (
      <View className="flex-1 aspect-square items-center justify-center">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-stone-50">
          <Text className="text-xs text-stone-300">{day.dayOfMonth}</Text>
        </View>
      </View>
    );
  }

  // Future date
  if (day.isFuture) {
    return (
      <View className="flex-1 aspect-square items-center justify-center">
        <View className="h-9 w-9 items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50">
          <Text className="text-xs text-stone-300">{day.dayOfMonth}</Text>
        </View>
      </View>
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
      entering={FadeIn.delay(index * 10).duration(200)}
      style={animatedStyle}
      className="flex-1 aspect-square items-center justify-center"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${day.date}. ${day.completed ? 'Completed' : 'Not completed'}`}
      accessibilityHint={day.isToday ? 'Today' : undefined}
      accessibilityState={{ selected: day.completed }}
    >
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
