/**
 * CalendarTabContent — monthly grid in a card, with optional legend/year strip.
 */
import type { ReactNode } from 'react';
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
  footer?: ReactNode;
  habit: Habit;
  habitColor: string;
  pendingToggleDate?: string | null;
  /** Hidden when the standalone "Year at a glance" card is already showing. */
  showYearSection?: boolean;
  yearCaption?: string | null;
  yearRangeLabel?: string;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  /** Hide the grid's month bar so History can sit it above this card. */
  hideGridNavigation?: boolean;
}

export function CalendarTabContent({
  completedDates,
  footer,
  habit,
  habitColor,
  pendingToggleDate = null,
  onDayPress,
  showYearSection = true,
  yearCaption,
  yearRangeLabel,
  month,
  onMonthChange,
  hideGridNavigation = false,
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
          hideNavigation={hideGridNavigation}
          pendingToggleDate={pendingToggleDate}
          showStreakInInsights={false}
          useSolidCompletedFill
          onCurrentMonthChange={setCurrentMonth}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
      {footer}
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
