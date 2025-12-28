/**
 * WeekGrid Component
 * Displays a single week view with larger, more detailed day cells
 * Focused view for current week progress
 *
 * HabitKit-inspired: Uses stronger haptic feedback for instant toggle feel
 * Supports GridTheme customization for cell colors and styling.
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { CalendarDay } from './types';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useGridThemeOptional } from './GridThemeContext';
import { useWeekStartOptional } from './WeekStartContext';
import {
  GITHUB_THEME,
  DEFAULT_WEEK_START,
  getRotatedDayLabels,
  getRotatedDayNamesFull,
  type GridTheme,
} from './types';

/**
 * Get streak-based color from theme for WeekGrid cells
 * Uses level2 color since week view cells are larger and more prominent
 */
function getWeekCellColor(theme: GridTheme, habitColor?: string): string {
  // Custom habit color takes precedence
  if (habitColor) {
    return habitColor;
  }
  // Use level3 color for larger cells - more visually impactful
  return theme.streakColors.level3;
}

export interface WeekGridProps {
  /** Array of 7 calendar days (Sunday to Saturday) */
  week: CalendarDay[];

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when a day cell is pressed */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Enable instant tap-to-toggle mode (defaults to true) */
  instantToggle?: boolean;
}

/**
 * Individual day cell for week view - larger and more detailed
 * Enhanced with HabitKit-style instant toggle animations
 * Uses GridTheme for colors and styling when available
 */
function WeekDayCell({
  day,
  index,
  habitColor,
  onPress,
  instantToggle = true,
  dayLabel,
  dayNameFull,
}: {
  day: CalendarDay;
  index: number;
  habitColor?: string;
  onPress?: (date: string, completed: boolean) => void;
  instantToggle?: boolean;
  /** Single-letter day label (rotated based on week start) */
  dayLabel: string;
  /** Full day name for accessibility (rotated based on week start) */
  dayNameFull: string;
}) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  // Get theme from context or fall back to default
  const themeContext = useGridThemeOptional();
  const theme = themeContext?.theme ?? GITHUB_THEME;

  // Compute completed color from theme
  const completedColor = useMemo(
    () => getWeekCellColor(theme, habitColor),
    [theme, habitColor]
  );

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
      scale.value = withSpring(0.95, { damping: 15 });
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
  }, [day, onPress, instantToggle, playCompletionAnimation, playUncompletionAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Fill background animation style
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fillScale.value }],
    opacity: fillScale.value,
  }));

  // Checkmark animation style
  const checkStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkScale.value },
      { rotate: `${checkRotation.value}deg` },
    ],
    opacity: checkScale.value,
  }));

  // Determine cell styling based on state - uses theme colors
  const getCellStyle = () => {
    if (day.isBeforeCreation) {
      return `border-stone-100`;
    }
    if (day.isFuture) {
      return 'border-dashed border-stone-200';
    }
    if (day.completed) {
      return 'border-transparent';
    }
    if (day.isToday) {
      return `border-2`;
    }
    return 'border-stone-200';
  };

  // Build background style from theme
  const cellBackgroundStyle = useMemo(() => {
    if (day.isBeforeCreation) {
      return { backgroundColor: theme.beforeCreationBackground };
    }
    if (day.isFuture) {
      return { backgroundColor: theme.futureBackground };
    }
    if (day.completed) {
      // Completed state uses theme-derived color (handled by fill animation)
      return undefined;
    }
    if (day.isToday) {
      return { backgroundColor: '#fffbeb', borderColor: theme.todayBorderColor }; // amber-50
    }
    return { backgroundColor: theme.incompleteBackground };
  }, [day, theme]);

  const isInteractive = day.date && !day.isFuture && !day.isBeforeCreation;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.delay(index * 50).duration(200)}
      style={animatedStyle}
      className="flex-1"
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isInteractive}
        className={`
          h-16 rounded-xl border-2 items-center justify-center overflow-hidden
          ${getCellStyle()}
        `}
        style={[
          cellBackgroundStyle,
          !instantToggle && day.completed ? { backgroundColor: completedColor } : undefined,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${dayNameFull}, ${day.dayOfMonth}${day.completed ? ', completed' : ''}${day.isToday ? ', today' : ''}`}
        accessibilityState={{ disabled: !isInteractive }}
        accessibilityHint={instantToggle ? 'Tap to toggle completion' : 'Tap to view details'}
      >
        {/* Animated fill background (for instant toggle mode) */}
        {instantToggle && (
          <Animated.View
            style={[
              fillStyle,
              {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: completedColor,
              },
            ]}
            className="rounded-xl"
          />
        )}

        {/* Day label */}
        <Text
          className={`text-xs font-medium mb-1 ${
            day.completed
              ? 'text-white/80'
              : day.isToday
                ? 'text-amber-600'
                : day.isFuture || day.isBeforeCreation
                  ? 'text-stone-300'
                  : 'text-stone-400'
          }`}
        >
          {dayLabel}
        </Text>

        {/* Animated checkmark (for instant toggle mode) */}
        {instantToggle ? (
          <Animated.View
            style={checkStyle}
            className="h-6 w-6 items-center justify-center rounded-full bg-white/20"
          >
            <Check size={14} color="white" strokeWidth={3} />
          </Animated.View>
        ) : day.completed ? (
          <View className="h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Check size={14} color="white" strokeWidth={3} />
          </View>
        ) : (
          <Text
            className={`text-lg font-bold ${
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

        {/* Show day number when not completed (behind animated elements) */}
        {instantToggle && (
          <Animated.View
            style={{ opacity: 1 - fillScale.value, position: 'absolute' }}
            className="items-center justify-center"
            pointerEvents="none"
          >
            <Text
              className={`text-lg font-bold mt-4 ${
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

        {/* Today indicator dot */}
        {day.isToday && !day.completed && (
          <View className="absolute bottom-1.5 h-1 w-1 rounded-full bg-amber-400" />
        )}
      </Pressable>
    </Animated.View>
  );
}

export function WeekGrid({ week, habitColor, onDayPress, instantToggle = true }: WeekGridProps) {
  // Get week start from context, falling back to Sunday if no provider
  const weekStartContext = useWeekStartOptional();
  const weekStartDay = weekStartContext?.weekStartDay ?? DEFAULT_WEEK_START;

  // Compute rotated day labels based on week start
  const dayLabels = useMemo(
    () => getRotatedDayLabels(weekStartDay),
    [weekStartDay]
  );
  const dayNamesFull = useMemo(
    () => getRotatedDayNamesFull(weekStartDay),
    [weekStartDay]
  );

  return (
    <View
      className="flex-row gap-2"
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Week view calendar"
    >
      {week.map((day, index) => (
        <WeekDayCell
          key={day.date || `day-${index}`}
          day={day}
          dayLabel={dayLabels[index]}
          dayNameFull={dayNamesFull[index]}
          index={index}
          habitColor={habitColor}
          onPress={onDayPress}
          instantToggle={instantToggle}
        />
      ))}
    </View>
  );
}

export default WeekGrid;
