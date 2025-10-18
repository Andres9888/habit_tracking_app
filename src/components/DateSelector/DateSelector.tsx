import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useDateSelectorLogic } from './DateSelector.hooks';

interface DateSelectorProps {
  dates: Date[];
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  canNavigateForward?: boolean;
}

const DateSelectorComponent: React.FC<DateSelectorProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
}) => {
  const { isToday, isFuture } = useDateSelectorLogic();

  // Get date range text (first and last date)
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  return (
    <View className='flex-col gap-4 pb-4 pt-4'>
      {/* Week Navigation Header */}
      <View className='flex-row items-center justify-between px-0'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6]'
          onPress={onPreviousWeek}
        >
          <ChevronLeft color='#101727' size={16} strokeWidth={2.25} />
        </Pressable>

        <Text className='text-[14px] leading-5 tracking-[-0.15px] text-[#4a5565]'>
          {dateRangeText}
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          onPress={onNextWeek}
        >
          <ChevronRight color='#101727' size={16} strokeWidth={2.25} />
        </Pressable>
      </View>

      {/* Days Row */}
      <View className='flex-row justify-between gap-1'>
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE').toUpperCase();
          const day = format(date, 'd');
          const month = format(date, 'MMM');
          const isCurrentDay = isToday(date);
          const isUpcoming = isFuture(date);

          const baseLabel = `${weekday}, ${month} ${day}`;
          const accessibilityLabel = isCurrentDay
            ? `Today, ${baseLabel}`
            : baseLabel;

          return (
            <View
              key={`day-${index}`}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole='text'
              className='flex-1 items-center gap-2'
            >
              <Text className='text-center text-[11px] font-normal uppercase leading-[16.5px] tracking-[0.34px] text-[#6a7282]'>
                {weekday}
              </Text>
              <View
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  isCurrentDay ? 'bg-[#101727]' : 'bg-transparent'
                } ${isUpcoming && !isCurrentDay ? 'opacity-50' : ''}`}
              >
                <Text
                  className={`text-center text-[17px] font-medium leading-[25.5px] tracking-[-0.43px] ${
                    isCurrentDay ? 'text-white' : 'text-[#364153]'
                  }`}
                >
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const DateSelector = memo(DateSelectorComponent);
