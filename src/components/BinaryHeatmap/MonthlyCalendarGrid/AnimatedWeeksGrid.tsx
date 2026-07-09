import React, { memo } from 'react';
import { View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { CalendarDay } from './CalendarDay';
import { styles } from './styles';
import type { DayData } from './types';

interface AnimatedWeeksGridProps {
  direction: 'left' | 'right';
  habitColor: string;
  completedBg: string;
  trackBg: string;
  monthKey: string;
  onPress: (dateString: string, isCompleted: boolean) => void;
  pendingToggleDate?: string | null;
  textColors: {
    inverse: string;
    muted: string;
    primary: string;
    tertiary: string;
  };
  useSolidCompletedFill?: boolean;
  weeks: DayData[][];
}

export const AnimatedWeeksGrid = memo(function AnimatedWeeksGrid({
  direction,
  habitColor,
  completedBg,
  trackBg,
  monthKey,
  onPress,
  pendingToggleDate = null,
  textColors,
  useSolidCompletedFill = false,
  weeks,
}: AnimatedWeeksGridProps) {
  const isToggleBlocked = pendingToggleDate !== null;

  const entering =
    direction === 'left'
      ? SlideInRight.withInitialValues({ originX: 24, opacity: 0 })
          .duration(durations.enter)
          .easing(enterEasing)
      : SlideInLeft.withInitialValues({ originX: -24, opacity: 0 })
          .duration(durations.enter)
          .easing(enterEasing);

  return (
    <View style={styles.weeksContainer}>
      <Animated.View
        key={monthKey}
        entering={entering}
        style={styles.weeksPage}
      >
        {(weeks ?? []).map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.row}>
            {(week ?? []).map((day) => (
              <CalendarDay
                key={day.dateString}
                completedBg={completedBg}
                day={day}
                habitColor={habitColor}
                isPending={day.dateString === pendingToggleDate}
                isToggleBlocked={isToggleBlocked}
                textColors={textColors}
                trackBg={trackBg}
                useSolidCompletedFill={useSolidCompletedFill}
                onPress={onPress}
              />
            ))}
          </View>
        ))}
      </Animated.View>
    </View>
  );
});
