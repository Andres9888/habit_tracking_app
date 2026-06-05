import React, { memo, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { useThemeColors } from '@/theme';
import { colors as palette } from '@/theme/colors';
import { api } from '../../../../convex/_generated/api';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { useCalendarDays } from './useCalendarDays';
import { useMonthInsights } from './useMonthInsights';
import { completedTint } from './chainColors';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { MonthNavigation } from './MonthNavigation';
import { MonthInsightStrip } from './MonthInsightStrip';
import { useMonthGridNavigation } from './useMonthGridNavigation';

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  completedDates,
  habitColor,
  habitCreatedAt,
  currentMonth: controlledMonth,
  onCurrentMonthChange,
  useSolidCompletedFill = false,
  showStreakInInsights = true,
  isToggling = false,
  onDayPress,
}: MonthlyCalendarGridProps) {
  const { colors, isDark } = useThemeColors();
  const {
    currentMonth,
    directionRef,
    goToNextMonth,
    goToPreviousMonth,
    monthSwipeGesture,
  } = useMonthGridNavigation(controlledMonth, onCurrentMonthChange);

  const { weeks } = useCalendarDays({
    completedDates,
    currentMonth,
    habitCreatedAt,
  });
  const insights = useMonthInsights(completedDates, currentMonth);
  const settings = useQuery(api.settings.get);
  const showConnections = settings?.showStreakConnections ?? true;

  const cardColor = isDark ? colors.card : palette.light.surfaceMuted;
  const completedBg = useMemo(
    () =>
      useSolidCompletedFill ? habitColor : completedTint(habitColor, cardColor),
    [useSolidCompletedFill, habitColor, cardColor]
  );

  const handleDayPress = useCallback(
    (dateString: string, completed: boolean) => {
      if (isToggling) return;
      onDayPress?.(dateString, completed);
    },
    [isToggling, onDayPress]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
          borderColor: colors.border,
          opacity: isToggling ? 0.65 : 1,
        },
      ]}
    >
      <MonthNavigation
        currentMonth={currentMonth}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
      <GestureDetector gesture={monthSwipeGesture}>
        <View collapsable={false}>
          <View style={styles.row}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
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
            completedBg={completedBg}
            direction={directionRef.current}
            habitColor={habitColor}
            isToggling={isToggling}
            monthKey={format(currentMonth, 'yyyy-MM')}
            showConnections={showConnections}
            textColors={{
              inverse: colors.text.inverse,
              muted: colors.gray[300],
              primary: colors.text.primary,
              tertiary: colors.text.tertiary,
            }}
            useSolidCompletedFill={useSolidCompletedFill}
            weeks={weeks}
            onPress={handleDayPress}
          />
        </View>
      </GestureDetector>

      <MonthInsightStrip {...insights} showStreak={showStreakInInsights} />
    </View>
  );
});
