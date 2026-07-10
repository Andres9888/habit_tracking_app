/**
 * CalendarDayNumber — the day-number text for the square calendar cell.
 * Solid-fill mode animates color via the shared fill progress (textStyle);
 * the tint mode keeps a static color because its fill never animates.
 */
import React from 'react';
import { Text, type TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface CalendarDayNumberProps {
  dayNumber: number | string;
  isToday: boolean;
  showCompleted: boolean;
  staticTextColor: string;
  textStyle: TextStyle;
  useSolidCompletedFill: boolean;
}

export function CalendarDayNumber({
  dayNumber,
  isToday,
  showCompleted,
  staticTextColor,
  textStyle,
  useSolidCompletedFill,
}: CalendarDayNumberProps) {
  const emphasis = [
    isToday && styles.todayText,
    showCompleted && { fontWeight: fontWeights.semibold },
  ];
  if (useSolidCompletedFill) {
    return (
      <AnimatedText style={[styles.dayText, textStyle, ...emphasis]}>
        {dayNumber}
      </AnimatedText>
    );
  }
  return (
    <Text style={[styles.dayText, { color: staticTextColor }, ...emphasis]}>
      {dayNumber}
    </Text>
  );
}
