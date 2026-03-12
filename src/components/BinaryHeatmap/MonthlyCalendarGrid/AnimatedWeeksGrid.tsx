import React, { memo } from 'react';
import { View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { CalendarDay } from './CalendarDay';
import { styles } from './styles';
import type { DayData } from './types';

interface AnimatedWeeksGridProps {
  direction: 'left' | 'right';
  habitColor: string;
  monthKey: string;
  onPress: (dateString: string, isCompleted: boolean) => void;
  textColors: { muted: string; primary: string; tertiary: string };
  weeks: DayData[][];
}

export const AnimatedWeeksGrid = memo(function AnimatedWeeksGrid({
  direction, habitColor, monthKey, onPress, textColors, weeks,
}: AnimatedWeeksGridProps) {
  const entering = direction === 'left'
    ? SlideInRight.withInitialValues({ originX: 24, opacity: 0 }).springify().damping(28).stiffness(180)
    : SlideInLeft.withInitialValues({ originX: -24, opacity: 0 }).springify().damping(28).stiffness(180);

  return (
    <View style={styles.weeksContainer}>
      <Animated.View key={monthKey} entering={entering}>
        {(weeks ?? []).map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.row}>
            {(week ?? []).map((day) => (
              <CalendarDay
                key={day.dateString}
                day={day}
                habitColor={habitColor}
                textColors={textColors}
                onPress={onPress}
              />
            ))}
          </View>
        ))}
      </Animated.View>
    </View>
  );
});
