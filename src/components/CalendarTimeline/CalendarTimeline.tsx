import React, { memo, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';

/** Completion status for a single day */
export interface DayCompletionStatus {
  /** Number of habits completed on this day */
  completed: number;
  /** Total number of habits for this day */
  total: number;
}

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
  /** Currently selected date (reserved for future interactive states) */
  selectedDate?: Date;
  /** Callback when a date is selected (reserved for future interactive states) */
  onDateSelect?: (date: Date) => void;
  /** Completion status for each day (indexed by date string YYYY-MM-DD) */
  completionByDay?: Record<string, DayCompletionStatus>;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
}

/** Animated completion indicator dot */
const CompletionDot: React.FC<{
  status: 'complete' | 'partial' | 'none' | 'future';
  reduceMotion?: boolean;
  isToday?: boolean;
}> = ({ status, reduceMotion = false, isToday = false }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }

    const springAnim = Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 200,
      useNativeDriver: true,
    });
    springAnim.start();

    // Pulse animation for today's incomplete status
    let pulseAnimation: Animated.CompositeAnimation | null = null;
    if (isToday && status !== 'complete' && status !== 'future') {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }

    // Cleanup function to stop animations
    return () => {
      springAnim.stop();
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
      pulseAnim.setValue(1);
    };
  }, [status, reduceMotion, isToday, scaleAnim, pulseAnim]);

  const getColor = () => {
    switch (status) {
      case 'complete':
        return '#10b981'; // emerald-500
      case 'partial':
        return '#f59e0b'; // amber-500
      case 'none':
        return '#e7e5e4'; // stone-200
      case 'future':
        return '#f5f5f4'; // stone-100
      default:
        return '#e7e5e4';
    }
  };

  const getSize = () => {
    if (status === 'complete') return 8;
    if (status === 'partial') return 6;
    return 5;
  };

  return (
    <Animated.View
      style={{
        width: getSize(),
        height: getSize(),
        borderRadius: getSize() / 2,
        backgroundColor: getColor(),
        transform: [
          { scale: scaleAnim },
          { scale: isToday && status !== 'complete' ? pulseAnim : 1 },
        ],
        // Glow effect for complete days
        ...(status === 'complete' && {
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 2,
        }),
      }}
    />
  );
};

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  showSeparator = true,
  highContrastMode = false,
  selectedDate: _selectedDate,
  onDateSelect: _onDateSelect,
  completionByDay = {},
  reduceMotion = false,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();

  // Helper to get completion status for a date
  const getCompletionStatus = (date: Date): 'complete' | 'partial' | 'none' | 'future' => {
    if (isFuture(date)) return 'future';

    const dateString = format(date, 'yyyy-MM-dd');
    const dayStatus = completionByDay[dateString];

    if (!dayStatus || dayStatus.total === 0) return 'none';
    if (dayStatus.completed === dayStatus.total) return 'complete';
    if (dayStatus.completed > 0) return 'partial';
    return 'none';
  };

  // Handle empty dates array
  if (dates.length === 0) {
    return null;
  }

  // Get date range text (first and last date) - safe array access
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
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
        currentDayBackground: '#1c1917', // stone-900
        currentDayText: '#ffffff',
        dayBackground: '#ffffff',
        dayBorder: 'transparent',
        dayText: '#44403c', // stone-700
        icon: '#44403c', // stone-700
        primaryText: '#1c1917', // stone-900
        secondaryText: '#a8a29e', // stone-400 - warmer
      };

  return (
    <View
      className='mb-0 rounded-2xl pb-3 pt-1'
      style={{
        backgroundColor: highContrastMode ? 'transparent' : '#fafaf9', // stone-50
      }}
    >
      {/* Week Navigation Header */}
      <View className='mb-2.5 flex-row items-center justify-between'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-9 w-7 items-center justify-center rounded-full'
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={onPreviousWeek}
        >
          <ChevronLeft color={colors.icon} size={18} strokeWidth={2} />
        </Pressable>

        <Text
          className='text-[16px] font-semibold leading-[24px]'
          style={{ color: colors.primaryText }}
        >
          {dateRangeText}
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-9 w-7 items-center justify-center rounded-full ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={onNextWeek}
        >
          <ChevronRight color={colors.icon} size={18} strokeWidth={2} />
        </Pressable>
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

          const completionStatus = getCompletionStatus(date);
          const hasCompletionData = Object.keys(completionByDay).length > 0;

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
                    ? '#fffbeb' // amber-50 subtle glow for today
                    : colors.dayBackground,
                  borderColor: isCurrentDay ? '#f59e0b' : (highContrastMode ? colors.dayBorder : 'transparent'), // amber-500 for today
                  borderWidth: isCurrentDay ? 2 : (highContrastMode && !isCurrentDay ? 2 : 0),
                }}
              >
                <Text
                  className='text-center text-[16px] font-semibold leading-[20px]'
                  style={{
                    color: isCurrentDay
                      ? '#b45309' // amber-700 for emphasis
                      : isUpcoming
                        ? '#d6d3d1' // stone-300 for future dates
                        : colors.dayText,
                    fontWeight: isCurrentDay ? '700' : '600',
                  }}
                >
                  {dayNumber}
                </Text>
              </View>

              {/* Completion indicator dot */}
              {hasCompletionData && (
                <View className='mt-1 h-2 items-center justify-center'>
                  <CompletionDot
                    isToday={isCurrentDay}
                    reduceMotion={reduceMotion}
                    status={completionStatus}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
