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

  // Get date range text (first and last date)
  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  return (
    <View className='flex-col gap-6 px-6 py-4'>
      {/* Week Navigation Header */}
      <View className='flex-row items-center justify-between px-0'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-10 w-10 items-center justify-center'
          onPress={onPreviousWeek}
        >
          <ChevronLeft color='#101727' size={16} strokeWidth={2.25} />
        </Pressable>

        <Text className='text-[16px] leading-6 tracking-[-0.3125px] text-[#4a5565]'>
          {dateRangeText}
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-10 w-10 items-center justify-center ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          onPress={onNextWeek}
        >
          <ChevronRight color='#101727' size={16} strokeWidth={2.25} />
        </Pressable>
      </View>

      {/* Days Row */}
      <View className='flex-row justify-between gap-1'>
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE'); // Mon, Tue, Wed, etc.
          const dayNumber = format(date, 'd'); // 13, 14, 15, etc.
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
              className='flex-1 items-center gap-2'
            >
              {/* Weekday label */}
              <Text className='text-center text-[12px] font-normal leading-[16px] text-[#6a7282]'>
                {weekday}
              </Text>

              {/* Date number with rounded box and shadow */}
              <View
                className={`h-12 w-12 items-center justify-center rounded-2xl ${
                  isCurrentDay ? 'bg-[#101828]' : 'bg-white'
                } ${isUpcoming && !isCurrentDay ? 'opacity-50' : ''}`}
                style={
                  isCurrentDay
                    ? {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                        elevation: 8,
                      }
                    : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 2,
                      }
                }
              >
                <Text
                  className={`text-center text-[16px] font-normal leading-[24px] tracking-[-0.3125px] ${
                    isCurrentDay ? 'text-white' : 'text-[#101828]'
                  }`}
                >
                  {dayNumber}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Gradient separator line - matches Figma design exactly */}
      {showSeparator && (
        <View
          className='h-[1px] w-full'
          style={{
            backgroundColor: '#ffb86a',
            opacity: 0.5,
          }}
        />
      )}
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
