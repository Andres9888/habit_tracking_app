import React, { memo, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import { addMonths, subMonths, format } from 'date-fns';
import { useThemeColors } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { useCalendarDays } from './useCalendarDays';
import { AnimatedWeeksGrid } from './AnimatedWeeksGrid';
import { MonthNavigation } from './MonthNavigation';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  habitId: _habitId,
  completedDates,
  habitColor,
  habitCreatedAt,
  onDayPress,
}: MonthlyCalendarGridProps) {
  const { colors, isDark } = useThemeColors();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const directionRef = useRef<'left' | 'right'>('right');
  const { days, weeks } = useCalendarDays({ completedDates, currentMonth, habitCreatedAt });

  const textColors = useMemo(
    () => ({ muted: isDark ? colors.gray[300] : colors.gray[300], primary: colors.text.primary, tertiary: colors.text.tertiary }),
    [isDark, colors]
  );

  const { completed, missed } = useMemo(() => {
    let c = 0, m = 0;
    for (const day of days) {
      if (!day.isCurrentMonth) continue;
      if (day.isCompleted) c++;
      else if (day.isMissed) m++;
    }
    return { completed: c, missed: m };
  }, [days]);

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

  const handleDayPress = useCallback(
    (dateString: string, isCompleted: boolean) => { onDayPress?.(dateString, isCompleted); },
    [onDayPress]
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor: colors.border }]}>
      <MonthNavigation
        completed={completed}
        currentMonth={currentMonth}
        habitColor={habitColor}
        missed={missed}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />

      <View style={styles.row}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.headerCell}>
            <Text style={[styles.headerText, { color: colors.text.tertiary }]}>{day}</Text>
          </View>
        ))}
      </View>

      <AnimatedWeeksGrid
        direction={directionRef.current}
        habitColor={habitColor}
        monthKey={format(currentMonth, 'yyyy-MM')}
        onPress={handleDayPress}
        textColors={textColors}
        weeks={weeks}
      />
    </View>
  );
});

export default MonthlyCalendarGrid;
