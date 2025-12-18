/**
 * CalendarTimeline - Option B: First-Time Pulsing Chevrons
 *
 * Enhancement: Chevrons pulse on first 2-3 app loads to guide new users
 * Perfect for: First-time user onboarding and discovery
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';

export interface CalendarTimelineProps {
  /** Array of dates to display in the timeline */
  dates: Date[];
  /** Callback for previous week navigation */
  onPreviousWeek?: () => void;
  /** Callback for next week navigation */
  onNextWeek?: () => void;
  /** Whether forward navigation is allowed */
  canNavigateForward?: boolean;
  /** Whether to show the gradient separator line */
  showSeparator?: boolean;
  /** Enables the high contrast theme */
  highContrastMode?: boolean;
  /** Respect reduce motion preferences */
  reduceMotion?: boolean;
  /** Currently selected date (reserved for future interactive states) */
  selectedDate?: Date;
  /** Callback when a date is selected (reserved for future interactive states) */
  onDateSelect?: (date: Date) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CalendarTimelineWithPulse: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  showSeparator = true,
  highContrastMode = false,
  reduceMotion = false,
  selectedDate: _selectedDate,
  onDateSelect: _onDateSelect,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();
  const [shouldPulse, setShouldPulse] = useState(true);
  const hasNavigated = useRef(false);

  // Shared values for pulsing animation
  const leftChevronScale = useSharedValue(1);
  const rightChevronScale = useSharedValue(1);
  const leftChevronOpacity = useSharedValue(1);
  const rightChevronOpacity = useSharedValue(1);

  // Handle empty dates array
  if (dates.length === 0) {
    return null;
  }

  // Get date range text (first and last date) - safe array access
  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  const colors = highContrastMode
    ? {
        currentDayBackground: '#facc15',
        currentDayText: '#000000',
        dayBackground: '#000000',
        dayBorder: '#facc15',
        dayText: '#ffffff',
        icon: '#facc15',
        primaryText: '#ffffff',
        secondaryText: '#facc15',
      }
    : {
        currentDayBackground: '#1a1a1a',
        currentDayText: '#ffffff',
        dayBackground: '#ffffff',
        dayBorder: 'transparent',
        dayText: '#1a1a1a',
        icon: '#1a1a1a',
        primaryText: '#1a1a1a',
        secondaryText: '#9ca3af',
      };

  // Start pulsing animation on mount (first-time user hint)
  // Only pulse chevrons that can actually navigate
  useEffect(() => {
    if (reduceMotion || !shouldPulse) {
      leftChevronScale.value = 1;
      rightChevronScale.value = 1;
      leftChevronOpacity.value = 1;
      rightChevronOpacity.value = 1;
      return;
    }

    // Pulse animation: scale + subtle opacity change
    // Repeats 3 times, then auto-stops
    const pulseAnimation = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) })
    );

    // Fade slightly during pulse
    const opacityAnimation = withSequence(
      withTiming(0.7, { duration: 600 }),
      withTiming(1, { duration: 600 })
    );

    // Always pulse left chevron (can always go back)
    leftChevronScale.value = withRepeat(pulseAnimation, 3, false);
    leftChevronOpacity.value = withRepeat(opacityAnimation, 3, false);

    // Only pulse right chevron if forward navigation is available
    if (canNavigateForward) {
      rightChevronScale.value = withDelay(150, withRepeat(pulseAnimation, 3, false));
      rightChevronOpacity.value = withDelay(150, withRepeat(opacityAnimation, 3, false));
    } else {
      rightChevronScale.value = 1;
      rightChevronOpacity.value = 1;
    }

    // Auto-stop after 4 seconds
    const timeout = setTimeout(() => {
      setShouldPulse(false);
    }, 4000);

    return () => {
      clearTimeout(timeout);
      cancelAnimation(leftChevronScale);
      cancelAnimation(rightChevronScale);
      cancelAnimation(leftChevronOpacity);
      cancelAnimation(rightChevronOpacity);
    };
  }, [
    shouldPulse,
    reduceMotion,
    canNavigateForward,
    leftChevronScale,
    rightChevronScale,
    leftChevronOpacity,
    rightChevronOpacity,
  ]);

  const leftChevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leftChevronScale.value }],
    opacity: leftChevronOpacity.value,
  }));

  const rightChevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rightChevronScale.value }],
    opacity: rightChevronOpacity.value,
  }));

  const handlePreviousWeek = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      setShouldPulse(false); // Stop pulsing once user navigates
    }
    onPreviousWeek?.();
  };

  const handleNextWeek = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      setShouldPulse(false); // Stop pulsing once user navigates
    }
    onNextWeek?.();
  };

  return (
    <View
      className='mb-0 rounded-2xl pb-3 pt-1'
      style={{
        backgroundColor: highContrastMode ? 'transparent' : '#f9fafb',
      }}
    >
      {/* Week Navigation Header with Pulsing Chevrons */}
      <View className='mb-2.5 flex-row items-center justify-between'>
        <AnimatedPressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-9 w-7 items-center justify-center rounded-full'
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={handlePreviousWeek}
          style={leftChevronAnimatedStyle}
        >
          <ChevronLeft color={colors.icon} size={18} strokeWidth={2} />
        </AnimatedPressable>

        <Text
          className='text-[17px] font-semibold leading-[22px]'
          style={{ color: colors.primaryText }}
        >
          {dateRangeText}
        </Text>

        <AnimatedPressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-9 w-7 items-center justify-center rounded-full ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={handleNextWeek}
          style={rightChevronAnimatedStyle}
        >
          <ChevronRight color={colors.icon} size={18} strokeWidth={2} />
        </AnimatedPressable>
      </View>

      {/* Days Row - Show all 7 days - aligned with habit icon center */}
      <View className='flex-row items-start justify-between'>
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE'); // Sun, Mon, Tue, etc.
          const dayNumber = format(date, 'd'); // 15, 16, 17, etc.
          const isCurrentDay = isToday(date);
          const isUpcoming = isFuture(date);

          const baseLabel = `${weekday}, ${format(date, 'MMM')} ${dayNumber}`;
          const accessibilityLabel = isCurrentDay
            ? `Today, ${baseLabel}`
            : baseLabel;

          return (
            <View
              key={`timeline-day-${index}`}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole='text'
              className='flex-1 items-center gap-0.5'
            >
              {/* Weekday label */}
              <Text
                className='text-center text-[13px] font-normal leading-[18px]'
                style={{ color: colors.secondaryText }}
              >
                {weekday}
              </Text>

              {/* Date number with rounded box */}
              <View
                className='h-9 w-9 items-center justify-center rounded-[11px]'
                style={{
                  backgroundColor: isCurrentDay
                    ? 'transparent'
                    : colors.dayBackground,
                  borderColor: isCurrentDay ? '#1a1a1a' : (highContrastMode ? colors.dayBorder : 'transparent'),
                  borderWidth: isCurrentDay ? 2 : (highContrastMode && !isCurrentDay ? 2 : 0),
                }}
              >
                <Text
                  className='text-center text-[17px] font-semibold leading-[22px]'
                  style={{
                    color: isCurrentDay
                      ? '#1a1a1a'
                      : colors.dayText,
                    fontWeight: isCurrentDay ? '700' : '600',
                  }}
                >
                  {dayNumber}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const CalendarTimelineOptionB = memo(CalendarTimelineWithPulse);
