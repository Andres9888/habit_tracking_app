import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { startOfMonth } from 'date-fns';
import { useThemeColors } from '@/theme';
import { colors as palette } from '@/theme/colors';
import { api } from '../../../../convex/_generated/api';
import { useCalendarDays } from './useCalendarDays';
import { useMonthInsights } from './useMonthInsights';
import { completedTint } from './chainColors';
import { useMonthGridNavigation } from './useMonthGridNavigation';
import type { MonthlyCalendarGridProps } from './types';

type GridProps = Pick<
  MonthlyCalendarGridProps,
  | 'completedDates'
  | 'habitColor'
  | 'habitCreatedAt'
  | 'currentMonth'
  | 'onCurrentMonthChange'
  | 'useSolidCompletedFill'
  | 'isToggling'
  | 'onDayPress'
>;

export function useMonthlyCalendarGridState({
  completedDates,
  habitColor,
  habitCreatedAt,
  currentMonth: controlledMonth,
  onCurrentMonthChange,
  useSolidCompletedFill = false,
  isToggling = false,
  onDayPress,
}: GridProps) {
  const { colors, isDark } = useThemeColors();
  const [pickerVisible, setPickerVisible] = useState(false);

  const minMonth = useMemo(
    () => (habitCreatedAt ? startOfMonth(new Date(habitCreatedAt)) : undefined),
    [habitCreatedAt]
  );
  const maxMonth = useMemo(() => startOfMonth(new Date()), []);

  const navigation = useMonthGridNavigation(
    controlledMonth,
    onCurrentMonthChange,
    minMonth,
    maxMonth
  );

  const { weeks } = useCalendarDays({
    completedDates,
    currentMonth: navigation.currentMonth,
    habitCreatedAt,
  });
  const insights = useMonthInsights(completedDates, navigation.currentMonth);
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

  return {
    colors,
    completedBg,
    handleDayPress,
    insights,
    isDark,
    isToggling,
    maxMonth,
    minMonth,
    navigation,
    pickerVisible,
    setPickerVisible,
    showConnections,
    weeks,
  };
}
