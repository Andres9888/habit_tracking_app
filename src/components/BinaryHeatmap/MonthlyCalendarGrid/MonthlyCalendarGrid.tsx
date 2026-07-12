import { useThemeColors } from '@/theme';
import { format } from 'date-fns';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { MonthInsightStrip } from './MonthInsightStrip';
import { MonthNavigation } from './MonthNavigation';
import { MonthWeeksSection } from './MonthWeeksSection';
import { styles } from './styles';
import type { MonthlyCalendarGridProps } from './types';
import { useCalendarDays } from './useCalendarDays';
import { useMonthGridNavigation } from './useMonthGridNavigation';
import { useMonthInsights } from './useMonthInsights';
import { useMonthlyCalendarGridDisplay } from './useMonthlyCalendarGridDisplay';

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
  const nav = useMonthGridNavigation(controlledMonth, onCurrentMonthChange);
  const { weeks } = useCalendarDays({
    completedDates,
    currentMonth: nav.currentMonth,
    habitCreatedAt,
  });
  const insights = useMonthInsights(completedDates, nav.currentMonth);
  const display = useMonthlyCalendarGridDisplay({
    cardColor: colors.card,
    habitColor,
    isDark,
    useSolidCompletedFill,
  });
  const monthKey = format(nav.currentMonth, 'yyyy-MM');
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
        bare
          ? null
          : {
              backgroundColor: display.cardBg,
              borderColor: colors.border,
            },
      ]}
    >
      <MonthNavigation
        currentMonth={nav.currentMonth}
        onNextMonth={nav.goToNextMonth}
        onPreviousMonth={nav.goToPreviousMonth}
      />
      {display.isSettingsReady ? (
        <MonthWeeksSection
          completedBg={display.completedBg}
          connectorStyle={display.connectorStyle}
          direction={nav.slideDirection}
          habitColor={habitColor}
          labelColor={colors.text.tertiary}
          monthKey={monthKey}
          monthSwipeGesture={nav.monthSwipeGesture}
          pendingToggleDate={pendingToggleDate}
          shape={display.dayShape}
          surfaceBg={display.cardBg}
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
      ) : null}
      <MonthInsightStrip
        {...insights}
        monthKey={monthKey}
        showStreak={showStreakInInsights}
      />
    </View>
  );
});
