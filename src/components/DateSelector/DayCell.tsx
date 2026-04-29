/**
 * DayCell — single day column for the DateSelector.
 */

import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface DayCellProps {
  accessibilityLabel: string;
  day: string;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  weekday: string;
}

export const DayCell = memo(function DayCell({
  accessibilityLabel,
  day,
  isCurrentDay,
  isUpcoming,
  weekday,
}: DayCellProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='flex-1 items-center gap-2'
    >
      <Text className='text-center text-sm font-medium uppercase leading-[18px] tracking-[0.34px]' style={{ color: themeColors.text.secondary }}>
        {weekday}
      </Text>
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${
          isCurrentDay ? 'bg-[#1c1917]' : 'bg-transparent'
        } ${isUpcoming && !isCurrentDay ? 'opacity-50' : ''}`}
      >
        <Text
          className={`text-center text-base font-medium leading-[25.5px] tracking-[-0.43px] ${
            isCurrentDay ? 'text-white' : 'text-[#364153]'
          }`}
        >
          {day}
        </Text>
      </View>
    </View>
  );
});
