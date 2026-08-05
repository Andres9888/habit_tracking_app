/* eslint-disable max-lines -- unified History card keeps month/year/activity together */
/**
 * CalendarTabContent — one unified card: interactive monthly grid on top,
 * chromeless year strip below a divider (tap a year cell to jump the month).
 */
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { format, parseISO, startOfMonth } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { colors as palette } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { CalendarZoomToggle, type CalendarZoom } from './CalendarZoomToggle';
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
  const [zoom, setZoom] = useState<CalendarZoom>('month');
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date())
  );
  const today = getLocalDateString();
  const completedToday = completedDates.has(today);

  const navigateToMonth = useCallback((dateString: string) => {
    const parsed = parseISO(dateString);
    if (!Number.isNaN(parsed.getTime())) setCurrentMonth(startOfMonth(parsed));
    setZoom('month');
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
      <View className='mb-3 flex-row items-baseline justify-between'>
        <Text
          accessibilityRole='header'
          style={{ ...typography.heading1, color: colors.text.primary }}
        >
          History
        </Text>
        <Text style={{ ...typography.caption, color: colors.text.tertiary }}>
          Month · Year
        </Text>
      </View>
      <CalendarZoomToggle value={zoom} onChange={setZoom} />
      {zoom === 'month' ? (
        <ErrorBoundary>
          <MonthlyCalendarGrid
            bare
            completedDates={completedDates}
            currentMonth={currentMonth}
            habitColor={habitColor}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            pendingToggleDate={pendingToggleDate}
            showInsights={false}
            showStreakInInsights={false}
            useSolidCompletedFill
            onCurrentMonthChange={setCurrentMonth}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <YearStrip
            completedDates={completedDates}
            habitColor={habitColor}
            habitCreatedAt={habit.createdAt}
            onNavigateToMonth={navigateToMonth}
          />
        </ErrorBoundary>
      )}

      <View
        style={{
          borderTopColor: colors.border,
          borderTopWidth: 1,
          marginTop: spacing.base,
          paddingTop: spacing.md,
        }}
      >
        <Text
          style={{
            ...typography.overline,
            color: colors.text.tertiary,
            fontWeight: fontWeights.bold,
          }}
        >
          Recent activity
        </Text>
        <View
          className='mt-2 flex-row items-start justify-between'
          style={{ gap: spacing.md }}
        >
          <View className='flex-1'>
            <Text
              style={{
                ...typography.bodySmall,
                color: colors.text.primary,
                fontWeight: fontWeights.bold,
              }}
            >
              Today · {format(new Date(), 'MMM d')}
            </Text>
            <Text
              style={{
                ...typography.bodySmall,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              {completedToday ? 'Completed' : 'Not completed yet'}
            </Text>
          </View>
          <Pressable
            accessibilityRole='button'
            style={{
              borderColor: colors.border,
              borderRadius: borderRadius.full,
              borderWidth: 1,
              minHeight: 36,
              justifyContent: 'center',
              paddingHorizontal: spacing.md,
            }}
            onPress={() => onDayPress(today, completedToday)}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.text.secondary,
                fontWeight: fontWeights.semibold,
              }}
            >
              Edit day
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
