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
}

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  showSeparator = true,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();

  // Handle empty dates array
  if (dates.length === 0) {
    return null;
  }

  // Get date range text (first and last date) - safe array access
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  return (
    <View className='mb-6'>
      {/* Week Navigation Header */}
      <View className='mb-6 flex-row items-center justify-between'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-10 w-7 items-center justify-center rounded-full'
          onPress={onPreviousWeek}
        >
          <ChevronLeft color='#1a1a1a' size={20} strokeWidth={2} />
        </Pressable>

        <Text className='text-[18px] font-semibold leading-[28px] text-[#1a1a1a]'>
          {dateRangeText}
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-10 w-7 items-center justify-center rounded-full ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          onPress={onNextWeek}
        >
          <ChevronRight color='#1a1a1a' size={20} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Days Row - Show all 7 days */}
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

          // Check if it's Sunday (last day of the week)
          const isSunday = format(date, 'EEE') === 'Sun';

          return (
            <View
              key={`timeline-day-${index}`}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole='text'
              className='flex-1 items-center gap-2'
            >
              {/* Weekday label */}
              <Text
                className={`text-center text-[14px] leading-[20px] ${
                  isSunday ? 'font-bold text-[#1a1a1a]' : 'font-normal text-[#8a8a8a]'
                }`}
              >
                {weekday}
              </Text>

              {/* Date number with rounded box */}
              <View
                className={`h-10 w-10 items-center justify-center rounded-[12px] ${
                  isCurrentDay ? 'bg-[#1a1a1a]' : 'bg-white'
                }`}
              >
                <Text
                  className={`text-center text-[16px] font-semibold leading-[24px] ${
                    isCurrentDay ? 'font-bold text-white' : 'text-[#1a1a1a]'
                  }`}
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
