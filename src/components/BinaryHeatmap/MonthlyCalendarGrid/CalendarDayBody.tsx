import React, { memo } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface CalendarDayBodyProps {
  cellPopStyle: AnimatedStyle<ViewStyle>;
  completedBg: string;
  dayNumber: number | string;
  fillMounted: boolean;
  fillStyle: AnimatedStyle<ViewStyle>;
  habitColor: string;
  isToday: boolean;
  showCompleted: boolean;
  showDot: boolean;
  staticTextColor: string;
  textStyle: AnimatedStyle<TextStyle>;
  useSolidCompletedFill: boolean;
}

export const CalendarDayBody = memo(function CalendarDayBody({
  cellPopStyle,
  completedBg,
  dayNumber,
  fillMounted,
  fillStyle,
  habitColor,
  isToday,
  showCompleted,
  showDot,
  staticTextColor,
  textStyle,
  useSolidCompletedFill,
}: CalendarDayBodyProps) {
  return (
    <Animated.View
      style={[
        styles.dayCell,
        cellPopStyle,
        isToday && { borderColor: habitColor, borderWidth: 2 },
      ]}
    >
      {fillMounted ? (
        <Animated.View
          style={[
            fillStyle,
            StyleSheet.absoluteFill,
            {
              backgroundColor: completedBg,
              borderRadius: borderRadius.small,
            },
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
          {dayNumber}
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
          {dayNumber}
        </Text>
      )}
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: habitColor }]} />
      ) : null}
    </Animated.View>
  );
});
