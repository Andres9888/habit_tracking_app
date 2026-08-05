import { useThemeColors } from '@/theme';
import { format } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { MonthInsightStrip } from './MonthInsightStrip';
import { MonthNavigation } from './MonthNavigation';
import { styles } from './styles';
import type { MonthlyCalendarGridProps } from './types';
import { useCalendarDays } from './useCalendarDays';
import { useMonthGridNavigation } from './useMonthGridNavigation';
import { useMonthInsights } from './useMonthInsights';
import { useMonthlyCalendarGridDisplay } from './useMonthlyCalendarGridDisplay';
import { WeekdayHeaderRow } from './WeekdayHeaderRow';

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  completedDates,
  habitColor,
  habitCreatedAt,
  currentMonth: controlledMonth,
  onCurrentMonthChange,
  useSolidCompletedFill = false,
  showStreakInInsights = true,
  pendingToggleDate = null,
  onDayPress,
  bare = false,
}: MonthlyCalendarGridProps) {
  const { colors, isDark } = useThemeColors();
  const {
    currentMonth,
    slideDirection,
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
  const { cardBg, completedBg, connectorStyle, dayShape } =
    useMonthlyCalendarGridDisplay({
      cardColor: colors.card,
      habitColor,
      isDark,
      useSolidCompletedFill,
    });
  const monthKey = format(currentMonth, 'yyyy-MM');
  // Memoized because AnimatedWeeksGrid and CalendarDay are both memo()'d and
  // this object is forwarded to every day cell. As an inline literal it changed
  // identity every render, so all ~42 animated cells re-rendered each time.
  const textColors = useMemo(
    () => ({
      inverse: colors.text.inverse,
      muted: colors.gray[300],
      primary: colors.text.primary,
      tertiary: colors.text.tertiary,
    }),
    [
      colors.text.inverse,
      colors.gray,
      colors.text.primary,
      colors.text.tertiary,
    ]
  );
  const handleDayPress = useCallback(
    (dateString: string, completed: boolean) => {
      if (pendingToggleDate) return;
      onDayPress?.(dateString, completed);
    },
    [pendingToggleDate, onDayPress]
  );

  return (
    <View
      style={[
        bare ? styles.bareContainer : styles.container,
        bare ? null : { backgroundColor: cardBg, borderColor: colors.border },
      ]}
    >
      <MonthNavigation
        currentMonth={currentMonth}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
      <GestureDetector gesture={monthSwipeGesture}>
        <View collapsable={false}>
          <WeekdayHeaderRow labelColor={colors.text.tertiary} />
          <AnimatedWeeksGrid
            completedBg={completedBg}
            surfaceBg={cardBg}
            connectorStyle={connectorStyle}
            direction={slideDirection}
            habitColor={habitColor}
            monthKey={monthKey}
            pendingToggleDate={pendingToggleDate}
            shape={dayShape}
            textColors={textColors}
            useSolidCompletedFill={useSolidCompletedFill}
            weeks={weeks}
            onPress={handleDayPress}
          />
        </View>
      </GestureDetector>
      <MonthInsightStrip
        {...insights}
        monthKey={monthKey}
        showStreak={showStreakInInsights}
      />
    </View>
  );
});
