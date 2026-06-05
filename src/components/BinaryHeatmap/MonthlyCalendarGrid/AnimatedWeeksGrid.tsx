import React, { memo, useState, useCallback } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
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
  showConnections: boolean;
  textColors: {
    inverse: string;
    muted: string;
    primary: string;
    tertiary: string;
  };
  useSolidCompletedFill?: boolean;
  isToggling?: boolean;
  weeks: DayData[][];
}

export const AnimatedWeeksGrid = memo(function AnimatedWeeksGrid({
  direction,
  habitColor,
  completedBg,
  monthKey,
  onPress,
  showConnections,
  textColors,
  useSolidCompletedFill = false,
  isToggling = false,
  weeks,
}: AnimatedWeeksGridProps) {
  const [rowWidth, setRowWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setRowWidth((prev) => (prev === w ? prev : w));
  }, []);

  const entering =
    direction === 'left'
      ? SlideInRight.withInitialValues({ originX: 24, opacity: 0 })
          .springify()
          .damping(28)
          .stiffness(180)
      : SlideInLeft.withInitialValues({ originX: -24, opacity: 0 })
          .springify()
          .damping(28)
          .stiffness(180);

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
                isToggling={isToggling}
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
