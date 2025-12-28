/**
 * MonthPickerSheet Component
 *
 * A modal sheet for selecting a specific month/year for the CalendarHeatmap component.
 * Provides quick navigation to any month within the allowed date range.
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react-native';
import {
  format,
  isSameMonth,
  startOfMonth,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
} from 'date-fns';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface MonthPickerSheetProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Currently selected month (0-11) */
  selectedMonth: number;
  /** Currently selected year */
  selectedYear: number;
  /** Callback when a month is selected */
  onSelectMonth: (month: number, year: number) => void;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Optional earliest date to allow selection (format: Date or YYYY-MM-DD) */
  minDate?: Date | string;
  /** Optional latest date to allow selection (format: Date or YYYY-MM-DD) */
  maxDate?: Date | string;
  /** Disable haptic feedback (default: false) */
  disableHaptics?: boolean;
}

/** Month names for display */
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Short month names for compact display */
const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

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
 * Check if a month/year is within the allowed range
 */
function isMonthInRange(
  month: number,
  year: number,
  minDate: Date | undefined,
  maxDate: Date | undefined
): boolean {
  const targetDate = new Date(year, month, 1);

  if (minDate) {
    const minMonthStart = startOfMonth(minDate);
    if (isBefore(targetDate, minMonthStart)) return false;
  }

  if (maxDate) {
    const maxMonthStart = startOfMonth(maxDate);
    if (isAfter(targetDate, maxMonthStart)) return false;
  }

  return true;
}

/**
 * Check if a year has any selectable months within the range
 */
function hasSelectableMonthsInYear(
  year: number,
  minDate: Date | undefined,
  maxDate: Date | undefined
): boolean {
  for (let month = 0; month < 12; month++) {
    if (isMonthInRange(month, year, minDate, maxDate)) {
      return true;
    }
  }
  return false;
}

/**
 * Single month cell component
 */
function MonthCell({
  month,
  year,
  isSelected,
  isCurrentMonth,
  isDisabled,
  onSelect,
  index,
  reduceMotion,
}: {
  month: number;
  year: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  index: number;
  reduceMotion: boolean;
}) {
  const staggerDelay = reduceMotion ? 0 : index * 30;

  return (
    <Animated.View
      entering={
        reduceMotion ? undefined : FadeInDown.delay(staggerDelay).springify()
      }
      style={{ padding: 4, width: '33.333%' }}
    >
      <Pressable
        accessibilityHint={
          isSelected
            ? 'Currently selected'
            : isDisabled
              ? 'Not available'
              : 'Double tap to select this month'
        }
        accessibilityLabel={`${MONTH_NAMES[month]} ${year}${isCurrentMonth ? ', current month' : ''}`}
        accessibilityRole='button'
        accessibilityState={{
          disabled: isDisabled,
          selected: isSelected,
        }}
        className={`items-center justify-center rounded-xl py-3 ${
          isSelected
            ? 'bg-emerald-500'
            : isCurrentMonth
              ? 'border-2 border-amber-400 bg-amber-50'
              : isDisabled
                ? 'bg-stone-100'
                : 'bg-stone-50'
        }`}
        disabled={isDisabled}
        onPress={onSelect}
      >
        <Text
          className={`text-sm font-medium ${
            isSelected
              ? 'text-white'
              : isDisabled
                ? 'text-stone-300'
                : isCurrentMonth
                  ? 'text-amber-700'
                  : 'text-stone-700'
          }`}
        >
          {MONTH_NAMES_SHORT[month]}
        </Text>
        {isSelected && (
          <View className='absolute right-1 top-1'>
            <Check color='#ffffff' size={12} strokeWidth={3} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Year section with 12 month cells
 */
function YearSection({
  year,
  selectedMonth,
  selectedYear,
  currentMonth,
  currentYear,
  minDate,
  maxDate,
  onSelectMonth,
  baseIndex,
  reduceMotion,
}: {
  year: number;
  selectedMonth: number;
  selectedYear: number;
  currentMonth: number;
  currentYear: number;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  onSelectMonth: (month: number, year: number) => void;
  baseIndex: number;
  reduceMotion: boolean;
}) {
  return (
    <View className='mb-4'>
      <Text
        accessibilityRole='header'
        className='mb-2 px-1 text-base font-semibold text-stone-700'
      >
        {year}
      </Text>
      <View className='flex-row flex-wrap'>
        {Array.from({ length: 12 }, (_, month) => {
          const isSelected = month === selectedMonth && year === selectedYear;
          const isCurrentMonth = month === currentMonth && year === currentYear;
          const isDisabled = !isMonthInRange(month, year, minDate, maxDate);

          return (
            <MonthCell
              key={month}
              index={baseIndex + month}
              isCurrentMonth={isCurrentMonth}
              isDisabled={isDisabled}
              isSelected={isSelected}
              month={month}
              reduceMotion={reduceMotion}
              year={year}
              onSelect={() => onSelectMonth(month, year)}
            />
          );
        })}
      </View>
    </View>
  );
}

/**
 * MonthPickerSheet - Modal for selecting a specific month/year
 *
 * Displays a grid of months organized by year, allowing quick navigation
 * to any month within the allowed date range.
 *
 * @example
 * ```tsx
 * <MonthPickerSheet
 *   visible={showMonthPicker}
 *   selectedMonth={currentMonth}
 *   selectedYear={currentYear}
 *   onSelectMonth={(month, year) => navigateToMonth(month, year)}
 *   onClose={() => setShowMonthPicker(false)}
 *   minDate={habitCreatedAt}
 *   maxDate={new Date()}
 * />
 * ```
 */
export function MonthPickerSheet({
  visible,
  selectedMonth,
  selectedYear,
  onSelectMonth,
  onClose,
  minDate: minDateProp,
  maxDate: maxDateProp,
  disableHaptics = false,
}: MonthPickerSheetProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  const reduceMotion = useReduceMotion();
  const scrollViewRef = useRef<ScrollView>(null);

  // Display year for year navigation (separate from selected year to enable smooth transitions)
  const [displayYear, setDisplayYear] = useState(selectedYear);
  const [yearNavDirection, setYearNavDirection] = useState<'prev' | 'next' | null>(null);

  // Animation values for year header
  const yearTextOpacity = useSharedValue(1);
  const yearTextTranslateX = useSharedValue(0);

  // Sync display year with selected year when sheet opens
  useEffect(() => {
    if (visible) {
      setDisplayYear(selectedYear);
      setYearNavDirection(null);
    }
  }, [visible, selectedYear]);

  // Parse date constraints
  const minDate = parseDate(minDateProp);
  const maxDate = parseDate(maxDateProp);

  // Current date for "Jump to Today" functionality
  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Generate list of years to display
  const years = useMemo(() => {
    const yearSet = new Set<number>();

    // Always include selected year and current year
    yearSet.add(selectedYear);
    yearSet.add(currentYear);

    // Calculate range based on min/max dates
    const startYear = minDate ? minDate.getFullYear() : currentYear - 5;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 1;

    for (let y = startYear; y <= endYear; y++) {
      if (hasSelectableMonthsInYear(y, minDate, maxDate)) {
        yearSet.add(y);
      }
    }

    // Sort years in descending order (most recent first)
    return [...yearSet].sort((a, b) => b - a);
  }, [selectedYear, currentYear, minDate, maxDate]);

  // Check if current month is selectable
  const canJumpToToday = useMemo(
    () => isMonthInRange(currentMonth, currentYear, minDate, maxDate),
    [currentMonth, currentYear, minDate, maxDate]
  );

  // Check if selected is different from current month
  const isCurrentMonthSelected =
    selectedMonth === currentMonth && selectedYear === currentYear;

  const handleSelectMonth = useCallback(
    (month: number, year: number) => {
      if (month === selectedMonth && year === selectedYear) {
        // Already selected - just close
        onClose();
        return;
      }

      // Haptic feedback on selection
      if (!disableHaptics) {
        triggerSelection();
      }

      // Apply the selection
      onSelectMonth(month, year);

      // Announce for accessibility
      AccessibilityInfo.announceForAccessibility(
        `Selected ${MONTH_NAMES[month]} ${year}`
      );

      // Close the modal
      onClose();
    },
    [
      selectedMonth,
      selectedYear,
      onSelectMonth,
      onClose,
      triggerSelection,
      disableHaptics,
    ]
  );

  const handleJumpToToday = useCallback(() => {
    if (!canJumpToToday) return;

    if (!disableHaptics) {
      triggerSelection();
    }

    onSelectMonth(currentMonth, currentYear);

    AccessibilityInfo.announceForAccessibility(
      `Jumped to ${MONTH_NAMES[currentMonth]} ${currentYear}`
    );

    onClose();
  }, [
    canJumpToToday,
    currentMonth,
    currentYear,
    onSelectMonth,
    onClose,
    triggerSelection,
    disableHaptics,
  ]);

  const handleClose = useCallback(() => {
    if (!disableHaptics) {
      triggerLightImpact();
    }
    onClose();
  }, [onClose, triggerLightImpact, disableHaptics]);

  // Navigate to previous/next year using header arrows (just updates display year, doesn't select)
  const handleYearNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      const targetYear =
        direction === 'prev' ? displayYear - 1 : displayYear + 1;

      // Check if target year has any selectable months
      if (!hasSelectableMonthsInYear(targetYear, minDate, maxDate)) {
        return;
      }

      if (!disableHaptics) {
        triggerLightImpact();
      }

      // Set direction for animation
      setYearNavDirection(direction);

      // Animate year text transition
      if (!reduceMotion) {
        const slideDistance = direction === 'next' ? -20 : 20;
        const animConfig = { duration: 150, easing: Easing.out(Easing.ease) };

        // Fade out with slide
        yearTextOpacity.value = withTiming(0, animConfig);
        yearTextTranslateX.value = withTiming(slideDistance, animConfig);

        // After fade out, update year and fade in
        setTimeout(() => {
          setDisplayYear(targetYear);
          yearTextTranslateX.value = -slideDistance;
          yearTextOpacity.value = withTiming(1, animConfig);
          yearTextTranslateX.value = withTiming(0, animConfig);
        }, 150);
      } else {
        setDisplayYear(targetYear);
      }

      AccessibilityInfo.announceForAccessibility(
        `Viewing ${targetYear}`
      );
    },
    [
      displayYear,
      minDate,
      maxDate,
      triggerLightImpact,
      disableHaptics,
      reduceMotion,
      yearTextOpacity,
      yearTextTranslateX,
    ]
  );

  // Animated style for year text
  const yearTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: yearTextOpacity.value,
    transform: [{ translateX: yearTextTranslateX.value }],
  }));

  // Can navigate to previous/next year
  const canNavigatePrev = useMemo(
    () => hasSelectableMonthsInYear(displayYear - 1, minDate, maxDate),
    [displayYear, minDate, maxDate]
  );

  const canNavigateNext = useMemo(
    () => hasSelectableMonthsInYear(displayYear + 1, minDate, maxDate),
    [displayYear, minDate, maxDate]
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      accessibilityLabel='Month picker'
      animationType={reduceMotion ? 'none' : 'slide'}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <Animated.View
          className='max-h-[70%] rounded-t-3xl bg-white px-4 pb-8 pt-5 shadow-2xl'
          entering={reduceMotion ? undefined : FadeIn.duration(200)}
        >
          {/* Header */}
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                <Calendar className='text-emerald-500' size={18} />
              </View>
              <Text
                accessibilityRole='header'
                className='text-lg font-semibold text-stone-800'
              >
                Select Month
              </Text>
            </View>

            <TouchableOpacity
              accessibilityHint='Closes the month selection modal'
              accessibilityLabel='Close month picker'
              accessibilityRole='button'
              className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
              hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
              onPress={handleClose}
            >
              <X className='text-stone-500' size={18} />
            </TouchableOpacity>
          </View>

          {/* Year Navigation Header */}
          <View className='mb-3 flex-row items-center justify-between rounded-xl bg-stone-50 px-2 py-2'>
            <TouchableOpacity
              accessibilityHint={
                canNavigatePrev
                  ? 'Navigate to previous year'
                  : 'No earlier year available'
              }
              accessibilityLabel={`Previous year, ${displayYear - 1}`}
              accessibilityRole='button'
              accessibilityState={{ disabled: !canNavigatePrev }}
              className={`h-8 w-8 items-center justify-center rounded-full ${
                canNavigatePrev ? 'bg-white' : 'bg-stone-100'
              }`}
              disabled={!canNavigatePrev}
              hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
              onPress={() => handleYearNavigation('prev')}
            >
              <ChevronLeft
                className={
                  canNavigatePrev ? 'text-stone-600' : 'text-stone-300'
                }
                size={20}
              />
            </TouchableOpacity>

            <Animated.Text
              className='text-lg font-bold text-stone-800'
              style={yearTextAnimatedStyle}
            >
              {displayYear}
            </Animated.Text>

            <TouchableOpacity
              accessibilityHint={
                canNavigateNext
                  ? 'Navigate to next year'
                  : 'No later year available'
              }
              accessibilityLabel={`Next year, ${displayYear + 1}`}
              accessibilityRole='button'
              accessibilityState={{ disabled: !canNavigateNext }}
              className={`h-8 w-8 items-center justify-center rounded-full ${
                canNavigateNext ? 'bg-white' : 'bg-stone-100'
              }`}
              disabled={!canNavigateNext}
              hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
              onPress={() => handleYearNavigation('next')}
            >
              <ChevronRight
                className={
                  canNavigateNext ? 'text-stone-600' : 'text-stone-300'
                }
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Month Grid - Show only the display year */}
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 280 }}
          >
            <Animated.View
              key={displayYear}
              entering={
                reduceMotion
                  ? undefined
                  : yearNavDirection === 'next'
                    ? FadeInRight.duration(200)
                    : yearNavDirection === 'prev'
                      ? FadeInLeft.duration(200)
                      : FadeIn.duration(200)
              }
            >
              <YearSection
                baseIndex={0}
                currentMonth={currentMonth}
                currentYear={currentYear}
                maxDate={maxDate}
                minDate={minDate}
                reduceMotion={reduceMotion}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                year={displayYear}
                onSelectMonth={handleSelectMonth}
              />
            </Animated.View>
          </ScrollView>

          {/* Jump to Today Button */}
          {canJumpToToday && !isCurrentMonthSelected && (
            <TouchableOpacity
              accessibilityHint='Jumps to the current month'
              accessibilityLabel={`Jump to today, ${MONTH_NAMES[currentMonth]} ${currentYear}`}
              accessibilityRole='button'
              className='mt-4 flex-row items-center justify-center rounded-xl bg-amber-100 py-3'
              onPress={handleJumpToToday}
            >
              <Calendar className='mr-2 text-amber-600' size={16} />
              <Text className='font-medium text-amber-700'>
                Jump to Today ({MONTH_NAMES_SHORT[currentMonth]} {currentYear})
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer hint */}
          <Text className='mt-3 text-center text-xs text-stone-400'>
            Select a month to navigate your habit calendar
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default MonthPickerSheet;
