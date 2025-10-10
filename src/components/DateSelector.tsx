import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

interface DateSelectorProps {
  dates: Date[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({ dates }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  return (
    <View className="flex-row justify-between px-11 py-0 h-20">
      {dates.map((date, index) => {
        const isCurrent = isToday(date);
        const month = format(date, 'MMM').toUpperCase();
        const day = format(date, 'd');
        const weekday = format(date, 'EEE').toUpperCase();

        const accessibilityLabel = isCurrent
          ? `Today, ${weekday} ${month} ${day}`
          : `${weekday} ${month} ${day}`;

        return (
          <View
            key={index}
            className="items-center gap-1 w-10"
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="text"
          >
            <Text className={`text-xs font-semibold tracking-widest text-center ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
              {month}
            </Text>
            <Text className={`text-[30px] font-bold leading-9 text-center ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
              {day}
            </Text>
            <Text className={`text-xs font-bold tracking-wide text-center ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
              {weekday}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
