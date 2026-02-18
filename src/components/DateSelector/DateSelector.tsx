import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useDateSelectorLogic } from './DateSelector.hooks';
import { DayCell } from './DayCell';

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

  const firstDate = dates[0];
  const lastDate = dates.at(-1) ?? firstDate;
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;

  return (
    <View className='flex-col gap-4 pb-4 pt-4'>
      <View className='flex-row items-center justify-between px-0'>
        <Pressable
          accessibilityLabel='Previous week'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] active:bg-stone-200'
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
          className={`h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] active:bg-stone-200 ${canNavigateForward ? '' : 'opacity-40'}`}
          disabled={!canNavigateForward}
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onNextWeek}
        >
          <ChevronRight color='#1c1917' size={16} strokeWidth={2} />
        </Pressable>
      </View>

      <View className='flex-row justify-between gap-1'>
        {dates.map((date, index) => {
          const weekday = format(date, 'EEE').toUpperCase();
          const day = format(date, 'd');
          const isCurrentDay = isToday(date);
          const baseLabel = `${weekday}, ${format(date, 'MMM')} ${day}`;

          return (
            <DayCell
              key={`day-${index}`}
              accessibilityLabel={
                isCurrentDay ? `Today, ${baseLabel}` : baseLabel
              }
              day={day}
              isCurrentDay={isCurrentDay}
              isUpcoming={isFuture(date)}
              weekday={weekday}
            />
          );
        })}
      </View>
    </View>
  );
};

export const DateSelector = memo(DateSelectorComponent);
