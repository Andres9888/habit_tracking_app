import React, { memo, useState, useCallback } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { CalendarDay } from './CalendarDay';
import { ChainConnectors } from './ChainConnectors';
import { styles } from './styles';
import type { DayData } from './types';

interface AnimatedWeeksGridProps {
  direction: 'left' | 'right';
  habitColor: string;
  completedBg: string;
  monthKey: string;
  onPress: (dateString: string, isCompleted: boolean) => void;
  pendingToggleDate?: string | null;
  showConnections: boolean;
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
  monthKey,
  onPress,
  pendingToggleDate = null,
  showConnections,
  textColors,
  useSolidCompletedFill = false,
  weeks,
}: AnimatedWeeksGridProps) {
  const [rowWidth, setRowWidth] = useState(0);
  const isToggleBlocked = pendingToggleDate !== null;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setRowWidth((prev) => (prev === w ? prev : w));
  }, []);

  const entering =
    direction === 'left'
      ? SlideInRight.withInitialValues({ originX: 24 })
          .duration(durations.enter)
          .easing(enterEasing)
      : SlideInLeft.withInitialValues({ originX: -24 })
          .duration(durations.enter)
          .easing(enterEasing);

  return (
    <View style={styles.weeksContainer} onLayout={onLayout}>
      <Animated.View
        key={monthKey}
        entering={entering}
        style={styles.weeksPage}
      >
        {(weeks ?? []).map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.row}>
            {showConnections ? (
              <ChainConnectors
                week={week}
                completedBg={completedBg}
                rowWidth={rowWidth}
              />
            ) : null}
            {(week ?? []).map((day) => (
              <CalendarDay
                key={day.dateString}
                completedBg={completedBg}
                day={day}
                habitColor={habitColor}
                isPending={day.dateString === pendingToggleDate}
                isToggleBlocked={isToggleBlocked}
                textColors={textColors}
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
