/**
 * CollapsibleCalendar Component
 *
 * Wrapper around CalendarHeatmap that adds expand/collapse functionality
 * to save vertical space while preserving calendar functionality.
 *
 * Features:
 * - Collapsed by default with optional 7-day mini preview
 * - Smooth height + opacity animation for expand/collapse
 * - Header with calendar icon, month/year, and chevron indicator
 * - Persists collapse state preference per habit
 * - Full accessibility support
 * - Grid theme picker with AsyncStorage persistence
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { format, subDays } from 'date-fns';

import { CalendarHeatmap } from './CalendarHeatmap';
import { ThemePickerSheet } from './ThemePickerSheet';
import { GridThemeProvider, useGridTheme } from './GridThemeContext';
import type { GridThemeName } from './types';
import type {
  CollapsibleCalendarProps,
  MiniPreviewDot,
} from './CollapsibleCalendarTypes';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import {
  getCalendarExpandedState,
  setCalendarExpandedState,
} from '../../utils/calendarCollapsePreferences';

/** Animation duration for expand/collapse (ms) */
const ANIMATION_DURATION = 300;

/** Estimated calendar height - used before measurement completes to avoid double render */
const ESTIMATED_CALENDAR_HEIGHT = 280;

/**
 * Generates the last 7 days for mini preview
 */
function generateMiniPreviewDots(
  completedDates: Set<string>
): MiniPreviewDot[] {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const dots: MiniPreviewDot[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = dateStr === todayStr;
    const isCompleted = completedDates.has(dateStr);

    let state: MiniPreviewDot['state'];
    if (isToday) {
      // For today, we use 'todayComplete' or 'todayIncomplete' to properly track completion
      state = isCompleted ? 'todayComplete' : 'todayIncomplete';
    } else if (isCompleted) {
      state = 'complete';
    } else {
      state = 'missed';
    }

    dots.push({ date: dateStr, state });
  }

  return dots;
}

/**
 * MiniPreviewDots Component
 * Shows a compact 7-day preview when calendar is collapsed
 */
const MiniPreviewDots = React.memo(function MiniPreviewDots({
  completedDates,
  habitColor,
}: {
  completedDates: Set<string>;
  habitColor?: string;
}) {
  const dots = useMemo(
    () => generateMiniPreviewDots(completedDates),
    [completedDates]
  );

  // Count completed days (including today if completed)
  const completedCount = dots.filter(
    (d) => d.state === 'complete' || d.state === 'todayComplete'
  ).length;

  return (
    <View
      accessible
      accessibilityLabel={`Last 7 days: ${completedCount} completed`}
      className='flex-row items-center gap-1.5'
    >
      {dots.map((dot) => {
        let bgColor: string;
        let hasBorder = false;

        if (dot.state === 'complete' || dot.state === 'todayComplete') {
          bgColor = habitColor || '#10b981'; // emerald-500
        } else if (dot.state === 'todayIncomplete') {
          bgColor = '#fef3c7'; // amber-100
          hasBorder = true;
        } else {
          bgColor = '#e7e5e4'; // stone-200 (missed or future)
        }

        return (
          <View
            key={dot.date}
            className='h-2 w-2 rounded-full'
            style={{
              backgroundColor: bgColor,
              ...(hasBorder && {
                borderColor: '#fbbf24', // amber-400
                borderWidth: 1,
              }),
            }}
          />
        );
      })}
    </View>
  );
});

/**
 * Inner CollapsibleCalendar content that uses the GridTheme context
 */
function CollapsibleCalendarContent({
  habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
  defaultExpanded = false,
  showMiniPreview = true,
  showThemeButton = true,
}: CollapsibleCalendarProps) {
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();
  const { themeName, setTheme } = useGridTheme();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // Use estimated height initially to avoid double-rendering for measurement
  const [contentHeight, setContentHeight] = useState(ESTIMATED_CALENDAR_HEIGHT);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Animation values
  const expandProgress = useSharedValue(defaultExpanded ? 1 : 0);
  const chevronRotation = useSharedValue(defaultExpanded ? 180 : 0);

  // Load persisted preference on mount
  // Note: expandProgress and chevronRotation are SharedValues and should NOT be in deps
  useEffect(() => {
    let isMounted = true;
    const loadPreference = async () => {
      try {
        const savedState = await getCalendarExpandedState(habitId);
        if (isMounted && savedState !== null) {
          setIsExpanded(savedState);
          expandProgress.value = savedState ? 1 : 0;
          chevronRotation.value = savedState ? 180 : 0;
        }
      } catch (error) {
        // Fall back to default state on error
        console.error('Error loading calendar collapse preference:', error);
      } finally {
        if (isMounted) {
          setHasLoadedPreference(true);
        }
      }
    };
    void loadPreference();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitId]);

  // Current month/year for header
  const monthYearLabel = useMemo(() => {
    return format(new Date(), 'MMMM yyyy');
  }, []);

  // Handle content height measurement - update if significantly different from estimate
  const handleContentLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    // Only update if height changed significantly (avoid unnecessary re-renders)
    if (height > 0 && Math.abs(height - contentHeight) > 10) {
      setContentHeight(height);
    }
  }, [contentHeight]);

  // Toggle expand/collapse
  const handleToggle = useCallback(() => {
    triggerSelection();
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    // Persist preference (fire-and-forget)
    void setCalendarExpandedState(habitId, newExpanded);

    const duration = reduceMotion ? 0 : ANIMATION_DURATION;
    const targetValue = newExpanded ? 1 : 0;
    const chevronTarget = newExpanded ? 180 : 0;

    expandProgress.value = withTiming(targetValue, {
      duration,
      easing: Easing.out(Easing.ease),
    });

    chevronRotation.value = withTiming(chevronTarget, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [
    isExpanded,
    habitId,
    reduceMotion,
    triggerSelection,
    expandProgress,
    chevronRotation,
  ]);

  // Animated styles for content container
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandProgress.value,
      [0, 1],
      [0, contentHeight]
    );
    const opacity = expandProgress.value;

    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  // Animated style for chevron rotation
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  // Theme picker handlers
  const handleOpenThemePicker = useCallback(() => {
    setShowThemePicker(true);
  }, []);

  const handleCloseThemePicker = useCallback(() => {
    setShowThemePicker(false);
  }, []);

  const handleSelectTheme = useCallback(
    (theme: GridThemeName) => {
      setTheme(theme);
    },
    [setTheme]
  );

  // Accessibility label
  const accessibilityLabel = useMemo(
    () =>
      `Calendar view for ${monthYearLabel}. ${isExpanded ? 'Expanded' : 'Collapsed'}. Double tap to ${isExpanded ? 'collapse' : 'expand'}.`,
    [monthYearLabel, isExpanded]
  );

  // Show skeleton placeholder while loading preferences to avoid layout shift
  if (!hasLoadedPreference) {
    return (
      <View className='overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm shadow-stone-200/50'>
        <View className='flex-row items-center justify-between p-4'>
          <View className='flex-row items-center gap-2'>
            <View className='h-8 w-8 items-center justify-center rounded-lg bg-stone-100' />
            <View>
              <View className='h-4 w-24 rounded bg-stone-100' />
              <View className='mt-1 h-3 w-16 rounded bg-stone-100' />
            </View>
          </View>
          <View className='h-5 w-5 rounded bg-stone-100' />
        </View>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className='overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm shadow-stone-200/50'
    >
      {/* Header (always visible) */}
      <Pressable
        accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} calendar view`}
        accessibilityRole='button'
        accessibilityState={{ expanded: isExpanded }}
        className='flex-row items-center justify-between p-4'
        testID='collapsible-calendar-header'
        onPress={handleToggle}
      >
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
            <Calendar className='text-emerald-500' size={16} />
          </View>
          <View>
            <Text className='text-base font-semibold text-stone-800'>
              Calendar View
            </Text>
            <Text className='text-xs text-stone-500'>{monthYearLabel}</Text>
          </View>
        </View>

        <View className='flex-row items-center gap-3'>
          {/* Mini preview when collapsed */}
          {!isExpanded && showMiniPreview && (
            <MiniPreviewDots
              completedDates={completedDates}
              habitColor={habitColor}
            />
          )}

          {/* Chevron indicator */}
          <Animated.View style={chevronAnimatedStyle}>
            <ChevronDown className='text-stone-400' size={20} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expandable Content */}
      <Animated.View style={contentAnimatedStyle}>
        <View className='px-2 pb-2' onLayout={handleContentLayout}>
          <CalendarHeatmap
            completedDates={completedDates}
            habitColor={habitColor}
            habitCreatedAt={habitCreatedAt}
            habitId={habitId}
            onDayPress={onDayPress}
            onThemePress={showThemeButton ? handleOpenThemePicker : undefined}
            showThemeButton={showThemeButton}
          />
        </View>
      </Animated.View>

      {/* Theme Picker Modal */}
      <ThemePickerSheet
        selectedTheme={themeName}
        visible={showThemePicker}
        onClose={handleCloseThemePicker}
        onSelectTheme={handleSelectTheme}
      />
    </View>
  );
}

/**
 * CollapsibleCalendar Component
 *
 * Wraps CalendarHeatmap with collapsible container functionality.
 * Memoized to prevent re-renders when parent updates unrelated props.
 * Includes GridThemeProvider for theme management with AsyncStorage persistence.
 */
export const CollapsibleCalendar = React.memo(function CollapsibleCalendar(
  props: CollapsibleCalendarProps
) {
  return (
    <GridThemeProvider persistSelection>
      <CollapsibleCalendarContent {...props} />
    </GridThemeProvider>
  );
});

export default CollapsibleCalendar;
