import { useThemeColors } from '@/theme';
import { colors as palette } from '@/theme/colors';
import { format } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { completedTint } from './chainColors';
import { MonthInsightStrip } from './MonthInsightStrip';
import { MonthNavigation } from './MonthNavigation';
import { styles } from './styles';
import type { MonthlyCalendarGridProps } from './types';
import { useCalendarDays } from './useCalendarDays';
import { useMonthGridNavigation } from './useMonthGridNavigation';
import { useMonthInsights } from './useMonthInsights';
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
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const showConnections = settings?.showStreakConnections ?? true;
  const monthKey = format(currentMonth, 'yyyy-MM');
  const cardBg = isDark ? colors.card : palette.light.surfaceMuted;
  const completedBg = useMemo(
    () =>
      useSolidCompletedFill ? habitColor : completedTint(habitColor, cardBg),
    [useSolidCompletedFill, habitColor, cardBg]
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
            direction={slideDirection}
            habitColor={habitColor}
            monthKey={monthKey}
            pendingToggleDate={pendingToggleDate}
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
      <MonthInsightStrip
        {...insights}
        monthKey={monthKey}
        showStreak={showStreakInInsights}
      />
    </View>
  );
});
