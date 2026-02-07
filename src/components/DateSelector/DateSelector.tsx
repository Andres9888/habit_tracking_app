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

  if (dates.length === 0) {
    return null;
  }

  // Get date range text (first and last date)
  const firstDate = dates[0];
  const lastDate = dates.at(-1) ?? firstDate;
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  return (
    <View className='flex-col gap-4 pb-4 pt-4'>
      {/* Week Navigation Header */}
      <View className='flex-row items-center justify-between px-0'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] active:bg-stone-200'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onPreviousWeek}
        >
          <ChevronLeft color='#1c1917' size={16} strokeWidth={2} />
        </Pressable>

        <Text className='text-[17px] leading-5 tracking-[-0.15px] text-stone-600'>
          {dateRangeText}
        </Text>

        <Pressable
          accessibilityLabel='Next week'
          accessibilityRole='button'
          accessibilityState={{ disabled: !canNavigateForward }}
          className={`h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6] active:bg-stone-200 ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNextWeek}
        >
          <ChevronRight color='#1c1917' size={16} strokeWidth={2} />
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
              <Text className='text-center text-[13px] font-medium uppercase leading-[18px] tracking-[0.34px] text-stone-500'>
                {weekday}
              </Text>
              <View
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  isCurrentDay ? 'bg-[#1c1917]' : 'bg-transparent'
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
