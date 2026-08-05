/**
 * HabitDetailHistory — the design's History frame, in order:
 *
 *   Full history · <year> → stats rail → year at a glance → last complete month
 *
 * ADAPTATION 1: the design draws History as its own pushed screen with a back
 * chevron. Here it stays an inline disclosure inside the detail modal, so the
 * frame's header row becomes a section heading with the year beside it — a back
 * button would be a lie about where you are.
 *
 * ADAPTATION 2: the interactive calendar, strength curve and goal card are NOT
 * in the design's frame, but this disclosure is their only route in the app, so
 * they sit behind HistoryMoreDisclosure rather than being deleted. At rest the
 * surface matches the design.
 */
import Animated, { FadeIn } from 'react-native-reanimated';
import type { Habit } from '../../../../features/habits/types';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme';
import { useInsightPalette } from '../../insightPalette';
import { HistoryHeading } from './HistoryHeading';
import { HistoryMoreDisclosure } from './HistoryMoreDisclosure';
import { HistoryStatsCard } from './HistoryStatsCard';
import { MonthGridCard } from './MonthGridCard';
import { useHistoryMonths } from './useHistoryMonths';
import { YearGlanceCard } from './YearGlanceCard';

interface HabitDetailHistoryProps {
  /** Rolling ~90-day window from the shared tracking buffer — calendar only. */
  completedDates: Set<string>;
  /** Year-to-date completions from useHabitInsights — feeds the trend math. */
  doneDates: Set<string>;
  habit: Habit;
  pendingToggleDate?: string | null;
  yearCompletions: number;
  yearRatePct: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function HabitDetailHistory({
  completedDates,
  doneDates,
  habit,
  pendingToggleDate = null,
  yearCompletions,
  yearRatePct,
  onDayPress,
}: HabitDetailHistoryProps) {
  const { colors } = useThemeColors();
  const palette = useInsightPalette();
  const reduceMotion = useReduceMotion();
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const months = useHistoryMonths({
    completedDates: doneDates,
    daysOfWeek: habit.daysOfWeek,
  });

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeIn.duration(durations.standard).easing(enterEasing)
      }
      style={{ gap: spacing.md }}
    >
      <HistoryHeading palette={palette} year={months.year} />
      <HistoryStatsCard
        bestStreak={habit.bestStreak ?? 0}
        palette={palette}
        yearCompletions={yearCompletions}
        yearRatePct={yearRatePct}
      />
      <YearGlanceCard
        caption={months.caption}
        completedDates={doneDates}
        habitColor={habitColor}
        habitCreatedAt={habit.createdAt}
        palette={palette}
        rangeLabel={months.rangeLabel}
      />
      {months.lastComplete ? (
        <MonthGridCard
          completedDates={doneDates}
          daysOfWeek={habit.daysOfWeek}
          isBest={months.lastComplete.month === months.best?.month}
          palette={palette}
          rate={months.lastComplete}
          year={months.year}
        />
      ) : null}
      <HistoryMoreDisclosure
        completedDates={completedDates}
        habit={habit}
        habitColor={habitColor}
        palette={palette}
        pendingToggleDate={pendingToggleDate}
        onDayPress={onDayPress}
      />
    </Animated.View>
  );
}
