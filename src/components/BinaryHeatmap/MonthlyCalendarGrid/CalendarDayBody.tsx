/**
 * CalendarDayBody — visual body of one day square.
 * Every active current-month day sits on a quiet "track" tile so gaps read
 * as not-yet, not broken; completed days fill over the tile in habit color.
 * Future / before-creation days show a faded tile; outside-month days render
 * as empty spacers. Today keeps its ring; today-completed adds a soft halo.
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';
import { hexToRgba } from './colors';
import type { DayData } from './types';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface CalendarDayBodyProps {
  cellPopStyle: ViewStyle;
  completedBg: string;
  day: DayData;
  fillMounted: boolean;
  fillStyle: ViewStyle;
  habitColor: string;
  isToday: boolean;
  showCompleted: boolean;
  showDot: boolean;
  staticTextColor: string;
  textStyle: TextStyle;
  trackBg: string;
  useSolidCompletedFill: boolean;
}

export const CalendarDayBody = memo(function CalendarDayBody({
  cellPopStyle,
  completedBg,
  day,
  fillMounted,
  fillStyle,
  habitColor,
  isToday,
  showCompleted,
  showDot,
  staticTextColor,
  textStyle,
  trackBg,
  useSolidCompletedFill,
}: CalendarDayBodyProps) {
  if (!day?.isCurrentMonth) {
    return <View style={styles.dayCell} />;
  }
  const inactive = Boolean(day.isFuture || day.isBeforeCreation);
  return (
    <Animated.View
      style={[
        styles.dayCell,
        { backgroundColor: trackBg },
        inactive && styles.inactiveCell,
        cellPopStyle,
        isToday && { borderColor: habitColor, borderWidth: 2 },
      ]}
    >
      {isToday && showCompleted ? (
        <View
          pointerEvents='none'
          style={[styles.todayHalo, { borderColor: hexToRgba(habitColor, 0.28) }]}
        />
      ) : null}
      {fillMounted ? (
        <Animated.View
          style={[
            fillStyle,
            StyleSheet.absoluteFill,
            { backgroundColor: completedBg, borderRadius: borderRadius.small },
          ]}
        />
      ) : null}
      {useSolidCompletedFill ? (
        <AnimatedText
          style={[
            styles.dayText,
            textStyle,
            isToday && styles.todayText,
            showCompleted && { fontWeight: fontWeights.semibold },
          ]}
        >
          {day.dayNumber}
        </AnimatedText>
      ) : (
        <Text
          style={[
            styles.dayText,
            { color: staticTextColor },
            isToday && styles.todayText,
            showCompleted && { fontWeight: fontWeights.semibold },
          ]}
        >
          {day.dayNumber}
        </Text>
      )}
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: habitColor }]} />
      ) : null}
    </Animated.View>
  );
});
