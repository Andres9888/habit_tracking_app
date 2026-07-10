import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';
import { CalendarDayBodyConnector } from './CalendarDayBodyConnector';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface CalendarDayBodyProps {
  cellPopStyle: ViewStyle;
  completedBg: string;
  connectorStyle: 'none' | 'small' | 'full';
  dayNumber: number | string;
  fillMounted: boolean;
  fillStyle: ViewStyle;
  habitColor: string;
  isToday: boolean;
  joinRight: boolean;
  showCompleted: boolean;
  showDot: boolean;
  staticTextColor: string;
  textStyle: TextStyle;
  useSolidCompletedFill: boolean;
}

export const CalendarDayBody = memo(function CalendarDayBody({
  cellPopStyle,
  completedBg,
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
}: CalendarDayBodyProps) {
  return (
    <Animated.View
      style={[
        styles.dayCell,
        cellPopStyle,
        // Today marker only while incomplete: the 2px border insets the inner
        // absoluteFill, so a completed today would render partially filled.
        isToday &&
          !showCompleted && { borderColor: habitColor, borderWidth: 2 },
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
      <CalendarDayBodyConnector
        connectorStyle={connectorStyle}
        habitColor={habitColor}
        joinRight={joinRight}
      />
    </Animated.View>
  );
});
