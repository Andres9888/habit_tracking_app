import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
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
  /** Currently selected date (reserved for future interactive states) */
  selectedDate?: Date;
  /** Callback when a date is selected (reserved for future interactive states) */
  onDateSelect?: (date: Date) => void;
}

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  showSeparator = true,
  highContrastMode = false,
  selectedDate: _selectedDate,
  onDateSelect: _onDateSelect,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();

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
        secondaryText: '#8a8a8a',
      };

  return (
    <View
      className='mb-0 rounded-2xl pb-3 pt-1'
      style={{
        backgroundColor: highContrastMode ? 'transparent' : '#f9fafb',
      }}
    >
      {/* Week Navigation Header */}
      <View className='mb-2.5 flex-row items-center justify-between'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-9 w-7 items-center justify-center rounded-full'
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
                className='h-8 w-8 items-center justify-center rounded-[10px]'
                style={{
                  backgroundColor: isCurrentDay
                    ? 'transparent'
                    : colors.dayBackground,
                  borderColor: isCurrentDay ? '#1a1a1a' : (highContrastMode ? colors.dayBorder : 'transparent'),
                  borderWidth: isCurrentDay ? 2 : (highContrastMode && !isCurrentDay ? 2 : 0),
                }}
              >
                <Text
                  className='text-center text-[15px] font-semibold leading-[20px]'
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

export const CalendarTimeline = memo(CalendarTimelineComponent);
