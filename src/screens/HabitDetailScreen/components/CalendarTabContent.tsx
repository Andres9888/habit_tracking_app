/**
 * CalendarTabContent — one unified card: interactive monthly grid on top,
 * chromeless year strip below a divider (tap a year cell to jump the month).
 */
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { parseISO, startOfMonth } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { colors as palette } from '../../../theme/colors';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { YearStrip } from './YearStrip';

interface CalendarTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  pendingToggleDate?: string | null;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function CalendarTabContent({
  completedDates,
  habit,
  habitColor,
  pendingToggleDate = null,
  onDayPress,
}: CalendarTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date())
  );

  const navigateToMonth = useCallback((dateString: string) => {
    const parsed = parseISO(dateString);
    if (!Number.isNaN(parsed.getTime())) setCurrentMonth(startOfMonth(parsed));
  }, []);

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl p-4'
      entering={FadeIn.duration(durations.standard).easing(enterEasing)}
      style={{
        ...shadows.subtle,
        backgroundColor: isDark ? colors.card : palette.light.cardElevated,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      <ErrorBoundary>
        <MonthlyCalendarGrid
          bare
          completedDates={completedDates}
          currentMonth={currentMonth}
          habitColor={habitColor}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          pendingToggleDate={pendingToggleDate}
          useSolidCompletedFill
          onCurrentMonthChange={setCurrentMonth}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
      <View
        className='mt-3 pt-3'
        style={{ borderTopColor: colors.border, borderTopWidth: 1 }}
      >
        <ErrorBoundary>
          <YearStrip
            completedDates={completedDates}
            habitColor={habitColor}
            habitCreatedAt={habit.createdAt}
            onNavigateToMonth={navigateToMonth}
          />
        </ErrorBoundary>
      </View>
    </Animated.View>
  );
}
