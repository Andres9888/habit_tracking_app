import React, { memo } from 'react';
import { View } from 'react-native';
import {
  GestureDetector,
  type GestureType,
} from 'react-native-gesture-handler';
import { format } from 'date-fns';
import type { DayData } from './types';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { WeekdayHeaderRow } from './WeekdayHeaderRow';

interface CalendarSwipeSectionProps {
  completedBg: string;
  direction: 'left' | 'right';
  gesture: GestureType;
  habitColor: string;
  isToggling: boolean;
  month: Date;
  showConnections: boolean;
  tertiaryColor: string;
  textColors: {
    inverse: string;
    muted: string;
    primary: string;
    tertiary: string;
  };
  useSolidCompletedFill: boolean;
  weeks: DayData[][];
  onPress: (dateString: string, completed: boolean) => void;
}

export const CalendarSwipeSection = memo(function CalendarSwipeSection({
  completedBg,
  direction,
  gesture,
  habitColor,
  isToggling,
  month,
  showConnections,
  tertiaryColor,
  textColors,
  useSolidCompletedFill,
  weeks,
  onPress,
}: CalendarSwipeSectionProps) {
  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false}>
        <WeekdayHeaderRow labelColor={tertiaryColor} />
        <AnimatedWeeksGrid
          completedBg={completedBg}
          direction={direction}
          habitColor={habitColor}
          isToggling={isToggling}
          monthKey={format(month, 'yyyy-MM')}
          showConnections={showConnections}
          textColors={textColors}
          useSolidCompletedFill={useSolidCompletedFill}
          weeks={weeks}
          onPress={onPress}
        />
      </View>
    </GestureDetector>
  );
});
