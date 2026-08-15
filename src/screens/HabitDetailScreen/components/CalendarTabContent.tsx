/**
 * CalendarTabContent — one unified card: interactive monthly grid on top,
 * "Year at a glance" below a divider (tap a year cell to jump the month).
 */
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { colors as palette } from '../../../theme/colors';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CalendarYearSection } from './CalendarYearSection';
import { useCalendarMonth } from './useCalendarMonth';

interface CalendarTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  pendingToggleDate?: string | null;
  /** Hidden when the standalone "Year at a glance" card is already showing. */
  showYearSection?: boolean;
  /** Trend line under the year strip, e.g. "May was your turning point." */
  yearCaption?: string | null;
  /** "Jan – Jul", derived from the elapsed months. */
  yearRangeLabel?: string;
  /** Controlled month. When omitted the grid starts on the current month. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function CalendarTabContent({
  completedDates,
  habit,
  habitColor,
  pendingToggleDate = null,
  onDayPress,
  showYearSection = true,
  yearCaption,
  yearRangeLabel,
  month,
  onMonthChange,
}: CalendarTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const { currentMonth, navigateToMonth, setCurrentMonth } = useCalendarMonth(
    month,
    onMonthChange
  );

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
          showStreakInInsights={false}
          useSolidCompletedFill
          onCurrentMonthChange={setCurrentMonth}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
      {showYearSection ? (
        <View
          className='mt-3 pt-3'
          style={{ borderTopColor: colors.border, borderTopWidth: 1 }}
        >
          <CalendarYearSection
            caption={yearCaption}
            completedDates={completedDates}
            habitColor={habitColor}
            habitCreatedAt={habit.createdAt}
            rangeLabel={yearRangeLabel}
            onNavigateToMonth={navigateToMonth}
          />
        </View>
      ) : null}
    </Animated.View>
  );
}
