/**
 * CalendarGrid Component
 * Displays the calendar grid with day cells
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { DayCell } from './DayCell';
import { DAY_LABELS, DAY_NAMES_FULL } from './utils';
import type { CalendarDay } from './types';

export interface CalendarGridProps {
  /** 2D array of calendar days (weeks x days) */
  grid: CalendarDay[][];

  /** Current month date for animation key */
  currentMonth: Date;

  /** Swipe direction for animations ('left' or 'right') */
  swipeDirection: 'left' | 'right';

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when a day cell is pressed */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Callback when user swipes right (previous month) */
  onSwipeRight?: () => void;

  /** Callback when user swipes left (next month) */
  onSwipeLeft?: () => void;

  /** Whether forward navigation is disabled (current month) */
  isCurrentMonth?: boolean;
}

// Swipe configuration
const SWIPE_THRESHOLD = 50; // Minimum distance to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 300; // Minimum velocity to trigger navigation

export function CalendarGrid({
  grid,
  currentMonth,
  swipeDirection,
  habitColor,
  onDayPress,
  onSwipeRight,
  onSwipeLeft,
  isCurrentMonth = false,
}: CalendarGridProps) {
  // Shared value for tracking horizontal translation during swipe
  const translateX = useSharedValue(0);

  // Pan gesture for horizontal swipe navigation
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15]) // Activate only for horizontal swipes
        .failOffsetY([-15, 15]) // Fail if vertical movement is detected (allow scrolling)
        .onUpdate((event) => {
          // Constrain translation for visual feedback
          const maxTranslation = 100;
          translateX.value = Math.max(
            -maxTranslation,
            Math.min(maxTranslation, event.translationX)
          );
        })
        .onEnd((event) => {
          const shouldNavigate =
            Math.abs(event.translationX) > SWIPE_THRESHOLD ||
            Math.abs(event.velocityX) > SWIPE_VELOCITY_THRESHOLD;

          if (shouldNavigate) {
            if (event.translationX > 0 && onSwipeRight) {
              // Swiped right → go to previous month
              onSwipeRight();
            } else if (event.translationX < 0 && !isCurrentMonth && onSwipeLeft) {
              // Swiped left → go to next month (only if not current month)
              onSwipeLeft();
            }
          }

          // Reset translation with spring animation
          translateX.value = 0;
        }),
    [isCurrentMonth, onSwipeRight, onSwipeLeft, translateX]
  );

  // Animated style for swipe feedback
  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 0.3 }], // Subtle parallax effect
  }));

  return (
    <View>
      {/* Day of week labels */}
      <View
        className="flex-row mb-2"
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel="Days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
      >
        {DAY_LABELS.map((label, index) => (
          <View
            key={index}
            className="flex-1 items-center"
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={DAY_NAMES_FULL[index]}
          >
            <Text className="text-xs font-medium text-stone-400" importantForAccessibility="no-hide-descendants">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid with Swipe Gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={swipeAnimatedStyle}>
          <Animated.View
            key={currentMonth.toISOString()}
            entering={
              swipeDirection === 'left'
                ? SlideInRight.duration(200)
                : SlideInLeft.duration(200)
            }
            exiting={
              swipeDirection === 'left'
                ? SlideOutLeft.duration(200)
                : SlideOutRight.duration(200)
            }
          >
            {grid.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row gap-1 mb-1">
                {week.map((day, dayIndex) => (
                  <DayCell
                    key={day.date || `empty-${weekIndex}-${dayIndex}`}
                    day={day}
                    index={weekIndex * 7 + dayIndex}
                    habitColor={habitColor}
                    onPress={onDayPress}
                  />
                ))}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default CalendarGrid;
