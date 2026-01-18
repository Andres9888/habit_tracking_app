import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import type { CalendarColors } from '../CalendarTimeline.types';

interface WeekNavigationHeaderProps {
  dateRangeText: string;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  canNavigateForward: boolean;
  colors: CalendarColors;
}

/** Navigation header with previous/next week controls */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  dateRangeText,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward,
  colors,
}) => {
  return (
    <View className='mb-2.5 flex-row items-center justify-between'>
      <Pressable
        accessibilityLabel='Previous week'
        accessibilityRole='button'
        className='h-9 w-7 items-center justify-center rounded-full'
        hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
        onPress={onPreviousWeek}
      >
        <ChevronLeft color={colors.icon} size={18} strokeWidth={2} />
      </Pressable>

      <Text
        className='text-[17px] font-semibold leading-[22px]'
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
        hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
        onPress={onNextWeek}
      >
        <ChevronRight color={colors.icon} size={18} strokeWidth={2} />
      </Pressable>
    </View>
  );
};
