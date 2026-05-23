import React, { memo, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { addMonths, subMonths, format } from 'date-fns';
import { useThemeColors } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { useCalendarDays } from './useCalendarDays';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { MonthNavigation } from './MonthNavigation';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HORIZONTAL_SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 450;

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  habitId: _habitId,
  completedDates,
  habitColor,
  habitCreatedAt,
  onDayPress,
}: MonthlyCalendarGridProps) {
  const { colors, isDark } = useThemeColors();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showChain, setShowChain] = useState(false);
  const directionRef = useRef<'left' | 'right'>('right');
  const { weeks } = useCalendarDays({
    completedDates,
    currentMonth,
    habitCreatedAt,
  });

  const textColors = useMemo(
    () => ({
      muted: isDark ? colors.gray[300] : colors.gray[300],
      primary: colors.text.primary,
      tertiary: colors.text.tertiary,
    }),
    [isDark, colors]
  );

  const goToPreviousMonth = useCallback(() => {
    directionRef.current = 'right';
    void triggerHaptic('selection');
    setCurrentMonth((p) => subMonths(p, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    directionRef.current = 'left';
    void triggerHaptic('selection');
    setCurrentMonth((p) => addMonths(p, 1));
  }, []);

  const handleMonthSwipe = useCallback(
    (translationX: number, velocityX: number) => {
      const swipedLeft =
        translationX <= -HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX <= -SWIPE_VELOCITY_THRESHOLD;
      if (swipedLeft) {
        goToNextMonth();
        return;
      }

      const swipedRight =
        translationX >= HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX >= SWIPE_VELOCITY_THRESHOLD;
      if (swipedRight) {
        goToPreviousMonth();
      }
    },
    [goToNextMonth, goToPreviousMonth]
  );

  const monthSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-18, 18])
        .failOffsetY([-20, 20])
        .onEnd((event) => {
          runOnJS(handleMonthSwipe)(event.translationX, event.velocityX);
        }),
    [handleMonthSwipe]
  );

  const handleDayPress = useCallback(
    (dateString: string, isCompleted: boolean) => {
      void triggerHaptic('toggle');
      onDayPress?.(dateString, isCompleted);
    },
    [onDayPress]
  );

  const toggleChain = useCallback(() => {
    void triggerHaptic('selection');
    setShowChain((v) => !v);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
        },
      ]}
    >
      <MonthNavigation
        currentMonth={currentMonth}
        habitColor={habitColor}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
        onToggleChain={toggleChain}
        showChain={showChain}
      />

      <GestureDetector gesture={monthSwipeGesture}>
        <View collapsable={false}>
          <View style={styles.row}>
            {DAY_HEADERS.map((day) => (
              <View key={day} style={styles.headerCell}>
                <Text
                  style={[styles.headerText, { color: colors.text.tertiary }]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <AnimatedWeeksGrid
            direction={directionRef.current}
            habitColor={habitColor}
            monthKey={format(currentMonth, 'yyyy-MM')}
            onPress={handleDayPress}
            showChain={showChain}
            textColors={textColors}
            weeks={weeks}
          />
        </View>
      </GestureDetector>
    </View>
  );
});

export default MonthlyCalendarGrid;
