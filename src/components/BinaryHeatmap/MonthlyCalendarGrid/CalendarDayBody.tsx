import React, { memo } from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import { borderRadius } from '@/theme/spacing';
import { CalendarDayBodyConnector } from './CalendarDayBodyConnector';
import { CalendarDayNumber } from './CalendarDayNumber';

interface CalendarDayBodyProps {
  cellPopStyle: AnimatedStyle<ViewStyle>;
  connectorStyle: 'none' | 'small' | 'full';
  dayNumber: number | string;
  fillMounted: boolean;
  fillStyle: AnimatedStyle<ViewStyle>;
  habitColor: string;
  isToday: boolean;
  joinRight: boolean;
  showCompleted: boolean;
  showDot: boolean;
  staticTextColor: string;
  textStyle: AnimatedStyle<TextStyle>;
  useSolidCompletedFill: boolean;
  isFuture?: boolean;
  isMissed?: boolean;
}

export const CalendarDayBody = memo(function CalendarDayBody({
  cellPopStyle,
  connectorStyle,
  dayNumber,
  fillMounted,
  fillStyle,
  habitColor,
  isToday,
  joinRight,
  showCompleted,
  showDot,
  staticTextColor,
  textStyle,
  useSolidCompletedFill,
  isFuture = false,
  isMissed = false,
}: CalendarDayBodyProps) {
  const circle = useSolidCompletedFill;
  return (
    <Animated.View
      style={[
        styles.dayCell,
        circle ? styles.dayCellCircle : null,
        cellPopStyle,
        circle && isFuture && !showCompleted ? styles.futureFill : null,
        circle && isMissed && !showCompleted && !isToday
          ? styles.missedRing
          : null,
        // Today ring only while incomplete: its border would inset the fill.
        isToday &&
          !showCompleted && { borderColor: habitColor, borderWidth: 2 },
      ]}
    >
      {fillMounted ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: circle ? 19 : borderRadius.small },
            fillStyle,
          ]}
        />
      ) : null}
      <CalendarDayNumber
        dayNumber={dayNumber}
        isToday={isToday}
        showCompleted={showCompleted}
        staticTextColor={staticTextColor}
        textStyle={textStyle}
        useSolidCompletedFill={useSolidCompletedFill}
      />
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: habitColor }]} />
      ) : null}
      <CalendarDayBodyConnector
        connectorStyle={connectorStyle}
        habitColor={habitColor}
        joinRight={joinRight}
      />
    </Animated.View>
  );
});
