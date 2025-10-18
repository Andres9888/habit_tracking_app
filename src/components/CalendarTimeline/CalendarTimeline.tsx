import React, { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';

export interface CalendarTimelineProps {
  /** Array of dates to display in the timeline */
  dates: Date[];
  /** Currently selected date (optional) */
  selectedDate?: Date;
  /** Callback when a date is selected (optional) */
  onDateSelect?: (date: Date) => void;
  /** Whether to show the gradient separator line */
  showSeparator?: boolean;
}

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  selectedDate,
  onDateSelect,
  showSeparator = true,
}) => {
  const { isDateSelected } = useCalendarTimelineLogic(selectedDate);

  return (
    <View className="flex-col gap-4 px-6 py-0">
      {/* Horizontal scrollable days container */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-6"
        className="overflow-visible"
      >
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE'); // Mon, Tue, Wed, etc.
          const dayNumber = format(date, 'd'); // 13, 14, 15, etc.
          const isSelected = isDateSelected(date);

          return (
            <View
              key={`timeline-day-${index}`}
              className="flex-col items-center gap-2 pb-1 pt-0"
              style={{ width: 60 }}
            >
              {/* Weekday label */}
              <View className="h-4">
                <Text className="text-center font-['Inter'] text-[12px] font-normal leading-[16px] text-[#6a7282]">
                  {weekday}
                </Text>
              </View>

              {/* Date number */}
              <View className="h-6">
                <Text
                  className={`text-center font-['Inter'] text-[16px] font-normal leading-[24px] tracking-[-0.3125px] ${
                    isSelected ? 'text-[#101727]' : 'text-[#4a5565]'
                  }`}
                  style={{ fontWeight: isSelected ? '600' : '400' }}
                >
                  {dayNumber}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Gradient separator line - matches Figma design exactly */}
      {showSeparator && (
        <View
          className="h-[1px] w-full"
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
