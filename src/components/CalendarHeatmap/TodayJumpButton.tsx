/**
 * TodayJumpButton Component
 *
 * A quick navigation button that jumps the calendar view to the current month/date.
 * Designed to be used alongside SwipeableMonthGrid and MonthPickerSheet for
 * comprehensive calendar navigation.
 *
 * Features:
 * - One-tap return to current month
 * - Visual indicator when viewing current month (hidden or dimmed)
 * - Haptic feedback on press
 * - Full accessibility support
 * - Animated entrance/exit
 * - Reduce motion support
 */

import React, { useCallback, useMemo } from 'react';
import {
  AccessibilityInfo,
  TouchableOpacity,
  Text,
  View,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { Calendar, ArrowRight } from 'lucide-react-native';
import { format, isSameMonth, isAfter, isBefore, startOfMonth } from 'date-fns';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';

/**
 * Props for TodayJumpButton component
 */
export interface TodayJumpButtonProps {
  /** Currently displayed month (0-11) */
  currentMonth: number;
  /** Currently displayed year */
  currentYear: number;
  /** Callback when button is pressed - receives current month/year for navigation */
  onJumpToToday: (month: number, year: number) => void;
  /** Optional minimum date constraint (Date or YYYY-MM-DD string) */
  minDate?: Date | string;
  /** Optional maximum date constraint (Date or YYYY-MM-DD string) */
  maxDate?: Date | string;
  /** Disable haptic feedback (default: false) */
  disableHaptics?: boolean;
  /** Button style variant */
  variant?: 'pill' | 'icon' | 'floating';
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Show text label (default: true for pill, false for icon/floating) */
  showLabel?: boolean;
  /** Custom label text (default: "Today") */
  label?: string;
  /** Hide button when already viewing current month (default: true) */
  hideWhenCurrent?: boolean;
}

/**
 * Parse date input to Date object
 * Handles YYYY-MM-DD strings by parsing as local time to avoid timezone issues
 */
function parseDate(date: Date | string | undefined): Date | undefined {
  if (!date) return undefined;

  // Check for Date objects (handles mocked Date in tests)
  if (
    typeof date === 'object' &&
    date !== null &&
    typeof date.getTime === 'function'
  ) {
    return date;
  }

  if (typeof date !== 'string') return undefined;

  // Parse YYYY-MM-DD as local date to avoid timezone issues
  const parts = date.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(date);
}

/**
 * Check if the current month is within the allowed navigation range
 */
function isCurrentMonthInRange(
  minDate: Date | undefined,
  maxDate: Date | undefined
): boolean {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);

  if (minDate) {
    const minMonthStart = startOfMonth(minDate);
    if (isBefore(currentMonthStart, minMonthStart)) return false;
  }

  if (maxDate) {
    const maxMonthStart = startOfMonth(maxDate);
    if (isAfter(currentMonthStart, maxMonthStart)) return false;
  }

  return true;
}

/**
 * TodayJumpButton - Quick navigation to current month/date
 *
 * @example
 * ```tsx
 * // Pill variant (default) - shows "Today" label
 * <TodayJumpButton
 *   currentMonth={displayedMonth}
 *   currentYear={displayedYear}
 *   onJumpToToday={(month, year) => navigateToMonth(month, year)}
 * />
 *
 * // Icon-only variant for compact spaces
 * <TodayJumpButton
 *   variant="icon"
 *   currentMonth={displayedMonth}
 *   currentYear={displayedYear}
 *   onJumpToToday={handleJump}
 * />
 *
 * // Floating action button style
 * <TodayJumpButton
 *   variant="floating"
 *   currentMonth={displayedMonth}
 *   currentYear={displayedYear}
 *   onJumpToToday={handleJump}
 * />
 * ```
 */
export function TodayJumpButton({
  currentMonth,
  currentYear,
  onJumpToToday,
  minDate: minDateProp,
  maxDate: maxDateProp,
  disableHaptics = false,
  variant = 'pill',
  style,
  showLabel,
  label = 'Today',
  hideWhenCurrent = true,
}: TodayJumpButtonProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  const reduceMotion = useReduceMotion();

  // Parse date constraints
  const minDate = parseDate(minDateProp);
  const maxDate = parseDate(maxDateProp);

  // Current date info
  const now = useMemo(() => new Date(), []);
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  // Check if currently viewing the current month
  const isViewingCurrentMonth = useMemo(() => {
    return currentMonth === todayMonth && currentYear === todayYear;
  }, [currentMonth, currentYear, todayMonth, todayYear]);

  // Check if can navigate to today (within date constraints)
  const canJumpToToday = useMemo(() => {
    return isCurrentMonthInRange(minDate, maxDate);
  }, [minDate, maxDate]);

  // Should button be visible
  const isVisible = useMemo(() => {
    if (!canJumpToToday) return false;
    if (hideWhenCurrent && isViewingCurrentMonth) return false;
    return true;
  }, [canJumpToToday, hideWhenCurrent, isViewingCurrentMonth]);

  // Determine if label should be shown based on variant
  const shouldShowLabel = useMemo(() => {
    if (showLabel !== undefined) return showLabel;
    return variant === 'pill';
  }, [showLabel, variant]);

  // Handle press
  const handlePress = useCallback(() => {
    if (!canJumpToToday) return;

    // Haptic feedback
    if (!disableHaptics) {
      if (variant === 'floating') {
        triggerLightImpact();
      } else {
        triggerSelection();
      }
    }

    // Navigate to current month
    onJumpToToday(todayMonth, todayYear);

    // Accessibility announcement
    const monthName = format(now, 'MMMM yyyy');
    AccessibilityInfo.announceForAccessibility(`Jumped to ${monthName}`);
  }, [
    canJumpToToday,
    disableHaptics,
    variant,
    triggerLightImpact,
    triggerSelection,
    onJumpToToday,
    todayMonth,
    todayYear,
    now,
  ]);

  // Generate accessibility label
  const accessibilityLabel = useMemo(() => {
    const monthName = format(now, 'MMMM yyyy');
    return `Jump to today, ${monthName}`;
  }, [now]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Render based on variant
  const renderContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <TouchableOpacity
            accessibilityHint='Returns calendar to current month'
            accessibilityLabel={accessibilityLabel}
            accessibilityRole='button'
            className='h-8 w-8 items-center justify-center rounded-full bg-amber-100'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={handlePress}
          >
            <Calendar className='text-amber-600' size={16} />
          </TouchableOpacity>
        );

      case 'floating':
        return (
          <TouchableOpacity
            accessibilityHint='Returns calendar to current month'
            accessibilityLabel={accessibilityLabel}
            accessibilityRole='button'
            className='h-12 w-12 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={handlePress}
          >
            <View className='flex-row items-center'>
              <Calendar color='#ffffff' size={20} />
            </View>
          </TouchableOpacity>
        );

      case 'pill':
      default:
        return (
          <TouchableOpacity
            accessibilityHint='Returns calendar to current month'
            accessibilityLabel={accessibilityLabel}
            accessibilityRole='button'
            className='flex-row items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={handlePress}
          >
            <Calendar className='text-amber-600' size={14} />
            {shouldShowLabel && (
              <Text className='text-xs font-medium text-amber-700'>{label}</Text>
            )}
            {shouldShowLabel && (
              <ArrowRight className='text-amber-500' size={12} />
            )}
          </TouchableOpacity>
        );
    }
  };

  // Animation settings
  const enteringAnimation = reduceMotion
    ? undefined
    : variant === 'floating'
      ? ZoomIn.springify()
      : FadeIn.duration(200);

  const exitingAnimation = reduceMotion
    ? undefined
    : variant === 'floating'
      ? ZoomOut.springify()
      : FadeOut.duration(150);

  return (
    <Animated.View
      entering={enteringAnimation}
      exiting={exitingAnimation}
      style={style}
    >
      {renderContent()}
    </Animated.View>
  );
}

export default TodayJumpButton;
