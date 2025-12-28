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
    case 'rounded-none': {
      return 0;
    }
    case 'rounded-sm': {
      return 2;
    }
    case 'rounded-md': {
      return 4;
    }
    case 'rounded-lg': {
      return 6;
    }
    case 'rounded-full': {
      return size / 2;
    }
    default: {
      return 2;
    }
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

/**
 * Calculate glow intensity based on streak strength
 * Returns 0 for no glow, higher values for stronger streaks
 */
function calculateGlowIntensity(streakPosition: number): number {
  if (streakPosition >= 30) return 1; // legendary - maximum glow
  if (streakPosition >= 14) return 0.75; // strong habit
  if (streakPosition >= 7) return 0.5; // week+ streak
  if (streakPosition >= 3) return 0.25; // starting momentum
  return 0; // too short for glow
}

/**
 * Check if current theme is the Pixels theme
 * Used for applying Pixels-specific visual effects like scanlines
 */
function isPixelsTheme(theme: GridTheme): boolean {
  return theme.id === 'pixels';
}

/**
 * Calculate scanline opacity for Pixels theme
 * Stronger streaks get more visible scanlines for that retro CRT feel
 */
function calculateScanlineOpacity(streakPosition: number): number {
  if (streakPosition >= 30) return 0.15; // legendary - prominent scanlines
  if (streakPosition >= 14) return 0.12; // strong habit
  if (streakPosition >= 7) return 0.1; // week+ streak
  return 0.08; // subtle scanlines for recent completions
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

export function DayCell({
  day,
  index,
  habitColor,
  onPress,
  completedDates,
  habitCreatedAt,
}: DayCellProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  // Separate animation values for streak glow effect
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
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
      withTiming(1.3, { duration: 200 }) // Hold briefly
    );

    const opacityAnimation = withSequence(
      withTiming(0.6, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 800, easing: Easing.in(Easing.ease) })
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

  // Calculate streak position early to use in glow effect
  // (must be before shouldShowGlowRing is determined in render)
  const currentStreakPosition =
    day.date && day.completed
      ? calculateStreakPosition(day.date, completedDates, habitCreatedAt)
      : 0;
  const currentGlowIntensity =
    theme.enableStreakGlow && day.completed
      ? calculateGlowIntensity(currentStreakPosition)
      : 0;
  const shouldShowGlowAnimation = currentGlowIntensity >= 0.5 && !reduceMotion;

  // Streak glow animation - subtle pulsing glow around strong streaks
  useEffect(() => {
    if (!shouldShowGlowAnimation) {
      // Reset glow values when not animating
      glowScale.value = 1;
      glowOpacity.value = 0;
      return;
    }

    // Slower, more subtle pulse for glow effect
    const glowPulseAnimation = withSequence(
      withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    );

    const glowOpacityAnimation = withSequence(
      withTiming(currentGlowIntensity * 0.7, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      withTiming(currentGlowIntensity * 0.3, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      })
    );

    // Start with a delay to let the cell fade in first
    glowScale.value = withDelay(
      300,
      withRepeat(glowPulseAnimation, -1, false) // Infinite repeat
    );
    glowOpacity.value = withDelay(
      300,
      withRepeat(glowOpacityAnimation, -1, false)
    );

    return () => {
      cancelAnimation(glowScale);
      cancelAnimation(glowOpacity);
    };
  }, [shouldShowGlowAnimation, currentGlowIntensity, glowScale, glowOpacity]);

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
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  // Animated style for streak glow ring
  const glowRingStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  // Staggered animation delay for all cell types - skip if reduceMotion
  const staggerDelay = reduceMotion ? 0 : index * 10;
  const fadeInAnimation = reduceMotion
    ? undefined
    : FadeIn.delay(staggerDelay).duration(200);

  // Get accessibility label
  const accessibilityLabel = getDayAccessibilityLabel(day);

  // Get color based on streak position using theme colors
  // Uses currentStreakPosition calculated earlier for glow effect
  // Note: Hooks must be called before any early returns per React rules
  const completedBgColor = useMemo(() => {
    if (!day.completed) return 'transparent';
    return getStreakColorFromTheme(currentStreakPosition, theme, habitColor);
  }, [day.completed, currentStreakPosition, theme, habitColor]);

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
      borderRadius,
      height: cellSize,
      width: cellSize,
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
        baseStyles.shadowOffset = { height: 1, width: 0 };
        baseStyles.shadowOpacity = 0.2;
        baseStyles.shadowRadius = 2;
        baseStyles.elevation = 2;
      }
      // Add glow effect for strong streaks
      if (theme.enableStreakGlow && currentGlowIntensity > 0) {
        baseStyles.shadowColor = completedBgColor;
        baseStyles.shadowOffset = { height: 0, width: 0 };
        baseStyles.shadowOpacity = currentGlowIntensity * 0.6;
        baseStyles.shadowRadius = 4 + currentGlowIntensity * 4; // 4-8px radius based on intensity
        baseStyles.elevation = Math.round(3 + currentGlowIntensity * 3); // 3-6 elevation
      }
    } else if (day.isToday) {
      // Today + not completed - highlight style
      // Use dark amber for Pixels theme (dark mode), light amber for others
      baseStyles.backgroundColor = isPixelsTheme(theme) ? '#451a03' : '#fffbeb'; // amber-950 : amber-50
      baseStyles.borderWidth = 2;
      baseStyles.borderColor = theme.todayBorderColor;
    } else {
      // Not completed (past) - incomplete style from theme
      baseStyles.backgroundColor = theme.incompleteBackground;
      if (theme.incompleteBorder !== 'none') {
        baseStyles.borderWidth = theme.incompleteBorderWidth;
        // Use dark border for Pixels theme (dark mode), light border for others
        baseStyles.borderColor = isPixelsTheme(theme) ? '#44403c' : '#e7e5e4'; // stone-700 : stone-200
        baseStyles.borderStyle =
          theme.incompleteBorder === 'dashed' ? 'dashed' : 'solid';
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
    currentGlowIntensity,
  ]);

  // Pulse ring style for today indicator
  const pulseRingDynamicStyles = useMemo(
    () => ({
      borderColor: theme.todayBorderColor,
      borderRadius,
      borderWidth: 2,
      height: cellSize,
      width: cellSize,
    }),
    [cellSize, borderRadius, theme.todayBorderColor]
  );

  // Glow ring style for streak glow effect (animated outer ring)
  const glowRingDynamicStyles = useMemo(
    () => ({
      borderColor: completedBgColor,
      borderRadius: borderRadius + 2,
      borderWidth: 1.5,
      height: cellSize + 4,
      width: cellSize + 4,
    }),
    [cellSize, borderRadius, completedBgColor]
  );

  // Checkmark size based on theme configuration
  const checkmarkSize = Math.round(cellSize * theme.checkmarkScale);

  // Pixels theme specific: show scanline effect on completed cells
  const shouldShowScanlines = isPixelsTheme(theme) && day.completed;
  const scanlineOpacity = shouldShowScanlines
    ? calculateScanlineOpacity(currentStreakPosition)
    : 0;

  // Empty padding cell
  if (day.date === null) {
    return (
      <Animated.View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        className='aspect-square flex-1'
        entering={fadeInAnimation}
      />
    );
  }

  // Before habit creation - dimmed/disabled appearance using theme colors
  if (day.isBeforeCreation) {
    const beforeCreationStyles = {
      backgroundColor: theme.beforeCreationBackground,
      borderRadius,
      height: cellSize,
      width: cellSize,
    };
    return (
      <Animated.View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        className='aspect-square flex-1 items-center justify-center'
        entering={fadeInAnimation}
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
      backgroundColor: theme.futureBackground,
      borderRadius,
      height: cellSize,
      width: cellSize,
    };
    if (theme.futureBorder !== 'none') {
      futureStyles.borderWidth = 1;
      // Use dark border for Pixels theme (dark mode), light border for others
      futureStyles.borderColor = isPixelsTheme(theme) ? '#44403c' : '#e7e5e4'; // stone-700 : stone-200
      futureStyles.borderStyle =
        theme.futureBorder === 'dashed' ? 'dashed' : 'solid';
    }
    return (
      <Animated.View
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        className='aspect-square flex-1 items-center justify-center'
        entering={fadeInAnimation}
      >
        <View style={[styles.cellBase, futureStyles]} />
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      accessible
      accessibilityHint={day.isToday ? 'Today' : 'Tap to view details'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: day.completed }}
      className='aspect-square flex-1 items-center justify-center'
      entering={fadeInAnimation}
      style={animatedStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Pulse ring for today's incomplete cell - draws attention to complete action */}
      {shouldPulse && (
        <Animated.View
          pointerEvents='none'
          style={[
            pulseRingStyle,
            pulseRingDynamicStyles,
            { position: 'absolute' },
          ]}
        />
      )}
      {/* Glow ring for strong streaks - animated pulsing ring around completed cells */}
      {shouldShowGlowAnimation && (
        <Animated.View
          pointerEvents='none'
          style={[
            glowRingStyle,
            glowRingDynamicStyles,
            { position: 'absolute' },
          ]}
          testID='glow-ring'
        />
      )}
      <View style={[styles.cellBase, cellStyles]}>
        {/* Pixels theme scanline overlay - creates retro CRT effect */}
        {shouldShowScanlines && (
          <View
            pointerEvents='none'
            style={[
              styles.scanlineOverlay,
              {
                borderRadius,
                height: cellSize,
                width: cellSize,
              },
            ]}
            testID='scanline-overlay'
          >
            {/* Generate multiple horizontal scanlines */}
            {Array.from({ length: Math.floor(cellSize / 3) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.scanline,
                  {
                    opacity: scanlineOpacity,
                    top: i * 3,
                  },
                ]}
              />
            ))}
          </View>
        )}
        {day.completed && theme.showCheckmark && (
          <Check className='text-white' size={checkmarkSize} strokeWidth={3} />
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

  // Individual scanline - thin horizontal line for CRT effect
  scanline: {
    backgroundColor: '#000000',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },

  // Pixels theme scanline overlay container
  scanlineOverlay: {
    overflow: 'hidden',
    position: 'absolute',
  },
});

export default DayCell;
