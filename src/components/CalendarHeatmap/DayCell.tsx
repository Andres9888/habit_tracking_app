/**
 * DayCell Component
 * Individual day cell in the calendar heatmap
 *
 * Supports GridTheme customization for cell shape, colors, and visual effects.
 */

import React, { useEffect, useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
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
import { getDayAccessibilityLabel, calculateStreakPosition } from './utils';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useGridThemeOptional } from './GridThemeContext';
import { GITHUB_THEME, type GridTheme, type CellShape } from './types';

/**
 * Convert CellShape to numeric border radius
 * Maps theme shape tokens to actual pixel values
 */
function getCellBorderRadius(shape: CellShape, size: number): number {
  switch (shape) {
    case 'rounded-none':
      return 0;
    case 'rounded-sm':
      return 2;
    case 'rounded-md':
      return 4;
    case 'rounded-lg':
      return 6;
    case 'rounded-full':
      return size / 2;
    default:
      return 2;
  }
}

/**
 * Get streak-based color from theme
 * Maps streak position (days in current streak) to color intensity
 */
function getStreakColorFromTheme(
  streakPosition: number,
  theme: GridTheme,
  habitColor?: string
): string {
  // If custom habit color is provided, use it
  if (habitColor) {
    return habitColor;
  }

  // Map streak position to theme color levels
  if (streakPosition >= 30) return theme.streakColors.level4; // legendary!
  if (streakPosition >= 14) return theme.streakColors.level3; // strong habit
  if (streakPosition >= 7) return theme.streakColors.level2; // week+ streak
  return theme.streakColors.level1; // recent completion (1-6 days)
}

export interface DayCellProps {
  day: CalendarDay;
  /** Index for staggered animation */
  index: number;
  /** Custom habit color (hex) */
  habitColor?: string;
  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
  /** Set of completed dates for streak calculation */
  completedDates: Set<string>;
  /** Habit creation timestamp for streak calculation */
  habitCreatedAt?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DayCell({ day, index, habitColor, onPress, completedDates, habitCreatedAt }: DayCellProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  // Get theme from context or fall back to default GitHub theme
  const themeContext = useGridThemeOptional();
  const theme = themeContext?.theme ?? GITHUB_THEME;

  // Compute theme-derived styles
  const cellSize = theme.cellSize.standard;
  const borderRadius = getCellBorderRadius(theme.cellShape, cellSize);

  // Today pulse animation - draws attention to complete action
  // Stops pulsing once completed. Intensity controlled by theme.
  const shouldPulse =
    day.isToday &&
    !day.completed &&
    !reduceMotion &&
    theme.todayPulseIntensity > 0;

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

  // Before habit creation - dimmed/disabled appearance using theme colors
  if (day.isBeforeCreation) {
    const beforeCreationStyles = {
      width: cellSize,
      height: cellSize,
      borderRadius,
      backgroundColor: theme.beforeCreationBackground,
    };
    return (
      <Animated.View
        entering={fadeInAnimation}
        className="flex-1 aspect-square items-center justify-center"
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <View style={[styles.cellBase, beforeCreationStyles]} />
      </Animated.View>
    );
  }

  // Future date - uses theme's future styling
  if (day.isFuture) {
    const futureStyles: {
      width: number;
      height: number;
      borderRadius: number;
      backgroundColor: string;
      borderWidth?: number;
      borderColor?: string;
      borderStyle?: 'solid' | 'dashed' | 'dotted';
    } = {
      width: cellSize,
      height: cellSize,
      borderRadius,
      backgroundColor: theme.futureBackground,
    };
    if (theme.futureBorder !== 'none') {
      futureStyles.borderWidth = 1;
      futureStyles.borderColor = '#e7e5e4'; // stone-200
      futureStyles.borderStyle = theme.futureBorder === 'dashed' ? 'dashed' : 'solid';
    }
    return (
      <Animated.View
        entering={fadeInAnimation}
        className="flex-1 aspect-square items-center justify-center"
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <View style={[styles.cellBase, futureStyles]} />
      </Animated.View>
    );
  }

  // Calculate streak position for color intensity
  const streakPosition = day.date && day.completed
    ? calculateStreakPosition(day.date, completedDates, habitCreatedAt)
    : 0;

  // Get color based on streak position using theme colors
  const completedBgColor = useMemo(() => {
    if (!day.completed) return 'transparent';
    return getStreakColorFromTheme(streakPosition, theme, habitColor);
  }, [day.completed, streakPosition, theme, habitColor]);

  // Build cell style object from theme configuration
  const cellStyles = useMemo(() => {
    const baseStyles: {
      width: number;
      height: number;
      borderRadius: number;
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
      borderStyle?: 'solid' | 'dashed' | 'dotted';
      shadowColor?: string;
      shadowOffset?: { width: number; height: number };
      shadowOpacity?: number;
      shadowRadius?: number;
      elevation?: number;
    } = {
      width: cellSize,
      height: cellSize,
      borderRadius,
    };

    if (day.completed) {
      baseStyles.backgroundColor = completedBgColor;
      if (day.isToday) {
        baseStyles.borderWidth = 2;
        baseStyles.borderColor = theme.todayBorderColor;
      }
      // Add shadow for completed cells if theme enables it
      if (theme.enableShadow) {
        baseStyles.shadowColor = theme.shadowColor;
        baseStyles.shadowOffset = { width: 0, height: 1 };
        baseStyles.shadowOpacity = 0.2;
        baseStyles.shadowRadius = 2;
        baseStyles.elevation = 2;
      }
    } else if (day.isToday) {
      // Today + not completed - highlight style
      baseStyles.backgroundColor = '#fffbeb'; // amber-50
      baseStyles.borderWidth = 2;
      baseStyles.borderColor = theme.todayBorderColor;
    } else {
      // Not completed (past) - incomplete style from theme
      baseStyles.backgroundColor = theme.incompleteBackground;
      if (theme.incompleteBorder !== 'none') {
        baseStyles.borderWidth = theme.incompleteBorderWidth;
        baseStyles.borderColor = '#e7e5e4'; // stone-200
        baseStyles.borderStyle = theme.incompleteBorder === 'dashed' ? 'dashed' : 'solid';
      }
    }

    return baseStyles;
  }, [
    cellSize,
    borderRadius,
    day.completed,
    day.isToday,
    completedBgColor,
    theme,
  ]);

  // Pulse ring style for today indicator
  const pulseRingDynamicStyles = useMemo(
    () => ({
      width: cellSize,
      height: cellSize,
      borderRadius,
      borderWidth: 2,
      borderColor: theme.todayBorderColor,
    }),
    [cellSize, borderRadius, theme.todayBorderColor]
  );

  // Checkmark size based on theme configuration
  const checkmarkSize = Math.round(cellSize * theme.checkmarkScale);

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
          style={[pulseRingStyle, pulseRingDynamicStyles, { position: 'absolute' }]}
          pointerEvents="none"
        />
      )}
      <View style={[styles.cellBase, cellStyles]}>
        {day.completed && theme.showCheckmark && (
          <Check className="text-white" size={checkmarkSize} strokeWidth={3} />
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cellBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DayCell;
