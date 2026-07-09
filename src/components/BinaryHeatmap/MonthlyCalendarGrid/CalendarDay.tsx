/**
 * CalendarDay — individual day cell for the monthly calendar grid.
 * Completed days use either a soft tint (default) or solid habit-color fill
 * (detail). Today-pending is a bare 2px habit-color ring with accent text.
 */

import React, { memo } from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { DayData } from './types';
import { styles } from './styles';
import { useDetailPressAnimation } from '@/hooks/useDetailPressAnimation';
import type { CalendarDayColors } from './CalendarDay.helpers';
import { CalendarDayBody } from './CalendarDayBody';
import { useCalendarDayCellState } from './useCalendarDayCellState';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  completedBg: string;
  trackBg: string;
  textColors: CalendarDayColors;
  useSolidCompletedFill?: boolean;
  isPending?: boolean;
  isToggleBlocked?: boolean;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  completedBg,
  trackBg,
  textColors,
  useSolidCompletedFill = false,
  isPending = false,
  isToggleBlocked = false,
  onPress,
}: CalendarDayProps) {
  const { animatedStyle: pressStyle, pressHandlers } = useDetailPressAnimation();
  const cell = useCalendarDayCellState({
    day,
    habitColor,
    isPending,
    isToggleBlocked,
    textColors,
    useSolidCompletedFill,
  });

  return (
    <AnimatedPressable
      accessibilityElementsHidden={!day?.isCurrentMonth}
      accessibilityHint={cell.a11y.hint}
      accessibilityLabel={cell.a11y.label}
      accessibilityRole='button'
      accessibilityState={{ disabled: cell.isDisabled, selected: cell.showCompleted }}
      disabled={cell.isDisabled}
      importantForAccessibility={day?.isCurrentMonth ? 'auto' : 'no-hide-descendants'}
      style={[styles.dayWrapper, pressStyle, cell.animation.pendingStyle]}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <CalendarDayBody
        cellPopStyle={cell.animation.cellPopStyle}
        completedBg={completedBg}
        day={day}
        fillMounted={cell.animation.fillMounted}
        fillStyle={cell.animation.fillStyle}
        habitColor={habitColor}
        isToday={cell.isToday}
        showCompleted={cell.showCompleted}
        showDot={Boolean(cell.showCompleted && !useSolidCompletedFill)}
        staticTextColor={cell.staticTextColor}
        textStyle={cell.animation.textStyle}
        trackBg={trackBg}
        useSolidCompletedFill={useSolidCompletedFill}
      />
    </AnimatedPressable>
  );
});
