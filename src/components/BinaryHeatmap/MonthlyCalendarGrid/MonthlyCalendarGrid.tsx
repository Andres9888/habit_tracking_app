import React, { memo } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/theme';
import { colors as palette } from '@/theme/colors';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { MonthNavigation } from './MonthNavigation';
import { MonthPicker } from './MonthPicker';
import { MonthInsightStrip } from './MonthInsightStrip';
import { CalendarSwipeSection } from './CalendarSwipeSection';
import { useMonthlyCalendarGridState } from './useMonthlyCalendarGridState';

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
  const state = useMonthlyCalendarGridState({
    completedDates,
    habitColor,
    habitCreatedAt,
    currentMonth: controlledMonth,
    onCurrentMonthChange,
    useSolidCompletedFill,
    isToggling,
    onDayPress,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
          borderColor: colors.border,
          opacity: state.isToggling ? 0.65 : 1,
        },
      ]}
    >
      <MonthNavigation
        canGoNext={state.navigation.canGoNextMonth}
        canGoPrevious={state.navigation.canGoPreviousMonth}
        currentMonth={state.navigation.currentMonth}
        onNextMonth={state.navigation.goToNextMonth}
        onOpenMonthPicker={() => state.setPickerVisible(true)}
        onPreviousMonth={state.navigation.goToPreviousMonth}
      />
      <CalendarSwipeSection
        completedBg={state.completedBg}
        direction={state.navigation.directionRef.current}
        gesture={state.navigation.monthSwipeGesture}
        habitColor={habitColor}
        isToggling={state.isToggling}
        month={state.navigation.currentMonth}
        showConnections={state.showConnections}
        tertiaryColor={colors.text.tertiary}
        textColors={{
          inverse: colors.text.inverse,
          muted: colors.gray[300],
          primary: colors.text.primary,
          tertiary: colors.text.tertiary,
        }}
        useSolidCompletedFill={useSolidCompletedFill}
        weeks={state.weeks}
        onPress={state.handleDayPress}
      />
      <MonthInsightStrip
        {...state.insights}
        showStreak={showStreakInInsights}
      />
      <MonthPicker
        currentMonth={state.navigation.currentMonth}
        habitColor={habitColor}
        maxDate={state.maxMonth}
        minDate={state.minMonth}
        visible={state.pickerVisible}
        onClose={() => state.setPickerVisible(false)}
        onSelectMonth={state.navigation.goToMonth}
      />
    </View>
  );
});
