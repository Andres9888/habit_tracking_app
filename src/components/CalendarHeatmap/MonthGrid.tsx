/**
 * MonthGrid Component
 * Traditional calendar grid showing a single month
 * Displays weeks as rows with day numbers visible
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import type { CalendarDay } from './types';
import { DAY_LABELS, DAY_NAMES_FULL } from './utils';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface MonthGridProps {
  /** 2D array of calendar days organized as weeks (rows) */
  grid: CalendarDay[][];

  /** Current month being displayed */
  month: number;

  /** Current year being displayed */
  year: number;

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when a day cell is pressed */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Enable instant tap-to-toggle mode (defaults to true) */
  instantToggle?: boolean;
}

/**
 * Individual day cell for month view
 * Enhanced with HabitKit-style instant toggle animations
 */
function MonthDayCell({
  day,
  rowIndex,
  colIndex,
  habitColor,
  onPress,
  instantToggle = true,
}: {
  day: CalendarDay;
  rowIndex: number;
  colIndex: number;
  habitColor?: string;
  onPress?: (date: string, completed: boolean) => void;
  instantToggle?: boolean;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  // Completion animation values
  const fillScale = useSharedValue(day.completed ? 1 : 0);
  const checkScale = useSharedValue(day.completed ? 1 : 0);
  const checkRotation = useSharedValue(day.completed ? 0 : -45);

  // CRITICAL: Sync animation state when day.completed changes from backend
  useEffect(() => {
    if (instantToggle) {
      const targetFill = day.completed ? 1 : 0;
      const targetCheck = day.completed ? 1 : 0;
      const targetRotation = day.completed ? 0 : -45;

      if (fillScale.value !== targetFill) {
        fillScale.value = targetFill;
        checkScale.value = targetCheck;
        checkRotation.value = targetRotation;
      }
    }
  }, [day.completed, instantToggle, fillScale, checkScale, checkRotation]);

  // Play completion animation
  const playCompletionAnimation = useCallback(() => {
    if (reduceMotion) {
      fillScale.value = 1;
      checkScale.value = 1;
      checkRotation.value = 0;
      return;
    }

    fillScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    checkScale.value = withDelay(
      100,
      withSequence(
        withSpring(1.3, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 15 })
      )
    );
    checkRotation.value = withDelay(
      100,
      withSpring(0, { damping: 12, stiffness: 200 })
    );
  }, [reduceMotion, fillScale, checkScale, checkRotation]);

  // Play un-completion animation
  const playUncompletionAnimation = useCallback(() => {
    if (reduceMotion) {
      fillScale.value = 0;
      checkScale.value = 0;
      checkRotation.value = -45;
      return;
    }

    checkScale.value = withTiming(0, { duration: 150 });
    checkRotation.value = withTiming(-45, { duration: 150 });
    fillScale.value = withDelay(100, withTiming(0, { duration: 200 }));
  }, [reduceMotion, fillScale, checkScale, checkRotation]);

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.9, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const handlePress = useCallback(() => {
    if (day.date && !day.isFuture && !day.isBeforeCreation) {
      // Strong haptic for instant feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Play animation before callback (optimistic UI)
      if (instantToggle) {
        if (day.completed) {
          playUncompletionAnimation();
        } else {
          playCompletionAnimation();
        }
      }

      onPress?.(day.date, day.completed);
    }
  }, [
    day,
    onPress,
    instantToggle,
    playCompletionAnimation,
    playUncompletionAnimation,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Fill background animation style
  const fillStyle = useAnimatedStyle(() => ({
    opacity: fillScale.value,
    transform: [{ scale: fillScale.value }],
  }));

  // Checkmark animation style
  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [
      { scale: checkScale.value },
      { rotate: `${checkRotation.value}deg` },
    ],
  }));

  // Empty padding cell
  if (!day.date) {
    return <View className='aspect-square flex-1' />;
  }

  // Determine cell styling based on state
  const getCellStyle = () => {
    if (day.isBeforeCreation) {
      return 'bg-stone-50';
    }
    if (day.isFuture) {
      return 'bg-stone-50 border border-dashed border-stone-200';
    }
    if (day.completed) {
      return '';
    }
    if (day.isToday) {
      return 'bg-amber-50 border-2 border-amber-300';
    }
    return 'bg-stone-100';
  };

  const isInteractive = !day.isFuture && !day.isBeforeCreation;
  const completedColor = habitColor || '#10b981';

  return (
    <Animated.View
      className='aspect-square flex-1 p-0.5'
      entering={
        reduceMotion
          ? undefined
          : FadeIn.delay(rowIndex * 30 + colIndex * 10).duration(150)
      }
      style={animatedStyle}
    >
      <Pressable
        accessible
        accessibilityHint={
          instantToggle ? 'Tap to toggle completion' : 'Tap to view details'
        }
        accessibilityLabel={`${DAY_NAMES_FULL[colIndex]}, ${day.dayOfMonth}${day.completed ? ', completed' : ''}${day.isToday ? ', today' : ''}`}
        accessibilityRole='button'
        accessibilityState={{ disabled: !isInteractive }}
        className={`flex-1 items-center justify-center overflow-hidden rounded-lg ${getCellStyle()}`}
        disabled={!isInteractive}
        style={
          !instantToggle && day.completed
            ? { backgroundColor: completedColor }
            : undefined
        }
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Animated fill background (for instant toggle mode) */}
        {instantToggle && (
          <Animated.View
            className='rounded-lg'
            style={[
              fillStyle,
              {
                backgroundColor: completedColor,
                height: '100%',
                position: 'absolute',
                width: '100%',
              },
            ]}
          />
        )}

        {/* Animated checkmark (for instant toggle mode) */}
        {instantToggle ? (
          <Animated.View
            className='items-center justify-center'
            style={checkStyle}
          >
            <Check color='white' size={16} strokeWidth={3} />
          </Animated.View>
        ) : day.completed ? (
          <View className='items-center justify-center'>
            <Check color='white' size={16} strokeWidth={3} />
          </View>
        ) : null}

        {/* Show day number when not completed (behind animated elements) */}
        {instantToggle && (
          <Animated.View
            className='items-center justify-center'
            pointerEvents='none'
            style={{ opacity: 1 - fillScale.value, position: 'absolute' }}
          >
            <Text
              className={`text-sm font-semibold ${
                day.isToday
                  ? 'text-amber-600'
                  : day.isFuture || day.isBeforeCreation
                    ? 'text-stone-300'
                    : 'text-stone-600'
              }`}
            >
              {day.dayOfMonth}
            </Text>
          </Animated.View>
        )}

        {/* Static day number for non-instant mode */}
        {!instantToggle && !day.completed && (
          <Text
            className={`text-sm font-semibold ${
              day.isToday
                ? 'text-amber-600'
                : day.isFuture || day.isBeforeCreation
                  ? 'text-stone-300'
                  : 'text-stone-600'
            }`}
          >
            {day.dayOfMonth}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function MonthGrid({
  grid,
  month,
  year,
  habitColor,
  onDayPress,
  instantToggle = true,
}: MonthGridProps) {
  const reduceMotion = useReduceMotion();
  const monthName = format(new Date(year, month), 'MMMM yyyy');

  return (
    <View
      accessible
      accessibilityLabel={`Calendar for ${monthName}`}
      accessibilityRole='none'
    >
      {/* Month header */}
      <Animated.View
        className='mb-3'
        entering={reduceMotion ? undefined : FadeInDown.duration(200)}
      >
        <Text className='text-center text-base font-semibold text-stone-700'>
          {monthName}
        </Text>
      </Animated.View>

      {/* Day of week headers */}
      <View className='mb-2 flex-row'>
        {DAY_LABELS.map((label, index) => (
          <View
            key={index}
            accessible
            accessibilityLabel={DAY_NAMES_FULL[index]}
            className='flex-1 items-center'
          >
            <Text className='text-xs font-medium text-stone-400'>{label}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className='gap-1'>
        {grid.map((week, rowIndex) => (
          <View key={rowIndex} className='flex-row'>
            {week.map((day, colIndex) => (
              <MonthDayCell
                key={day.date || `empty-${rowIndex}-${colIndex}`}
                colIndex={colIndex}
                day={day}
                habitColor={habitColor}
                instantToggle={instantToggle}
                rowIndex={rowIndex}
                onPress={onDayPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export default MonthGrid;
