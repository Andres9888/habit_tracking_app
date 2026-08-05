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
import { ChainDayBody } from './ChainDayBody';
import { useCalendarDayCellState } from './useCalendarDayCellState';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  completedBg: string;
  surfaceBg: string;
  textColors: CalendarDayColors;
  useSolidCompletedFill?: boolean;
  isPending?: boolean;
  isToggleBlocked?: boolean;
  shape?: 'circle' | 'square';
  connectorStyle?: 'none' | 'small' | 'full';
  joinRight?: boolean;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  completedBg,
  surfaceBg,
  textColors,
  useSolidCompletedFill = false,
  isPending = false,
  isToggleBlocked = false,
  shape = 'square',
  connectorStyle = 'full',
  joinRight = false,
  onPress,
}: CalendarDayProps) {
  const { animatedStyle: pressStyle, pressHandlers } =
    useDetailPressAnimation();
  const cell = useCalendarDayCellState({
    completedBg,
    day,
    habitColor,
    isPending,
    isToggleBlocked,
    surfaceBg,
    textColors,
    useSolidCompletedFill,
  });

  return (
    <AnimatedPressable
      accessibilityHint={cell.a11y.hint}
      accessibilityLabel={cell.a11y.label}
      accessibilityRole='button'
      accessibilityState={{
        disabled: cell.isDisabled,
        selected: cell.showCompleted,
      }}
      disabled={cell.isDisabled}
      style={[styles.dayWrapper, pressStyle, cell.animation.pendingStyle]}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      {shape === 'circle' ? (
        <ChainDayBody
          connectorStyle={connectorStyle}
          day={day}
          habitColor={habitColor}
          joinRight={joinRight}
        />
      ) : (
        <CalendarDayBody
          cellPopStyle={cell.animation.cellPopStyle}
          connectorStyle={connectorStyle}
          dayNumber={day?.dayNumber ?? ''}
          fillMounted={cell.animation.fillMounted}
          fillStyle={cell.animation.fillStyle}
          habitColor={habitColor}
          isToday={cell.isToday}
          joinRight={joinRight}
          showCompleted={cell.showCompleted}
          showDot={cell.showCompleted ? !useSolidCompletedFill : false}
          staticTextColor={cell.staticTextColor}
          textStyle={cell.animation.textStyle}
          useSolidCompletedFill={useSolidCompletedFill}
        />
      )}
    </AnimatedPressable>
  );
});
