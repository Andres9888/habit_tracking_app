/**
 * HabitDetailHistory — everything the redesigned stack pushes behind
 * "View history ›", laid out as the prototype's History frame:
 *
 *   Full history · <year> → stats rail → calendar + year at a glance
 *   → last complete month → strength curve → goal card
 *
 * ADAPTATION: the design draws History as its own pushed screen with a back
 * chevron. Here it stays an inline disclosure inside the detail modal, so the
 * frame's header row becomes a section heading with the year beside it — a back
 * button would be a lie about where you are. The strength curve and goal card
 * are appended because this disclosure is their only route in the app.
 */
import Animated, { FadeIn } from 'react-native-reanimated';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../../components/HabitStrengthSection';
import type { Habit } from '../../../../features/habits/types';
import { useProgressEmojis } from '../../../../hooks/useProgressEmojis';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { spacing } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme';
import { useInsightPalette } from '../../insightPalette';
import { CalendarTabContent } from '../CalendarTabContent';
import { GoalTabContent } from '../GoalTabContent';
import { HistoryHeading } from './HistoryHeading';
import { HistoryStatsCard } from './HistoryStatsCard';
import { MonthGridCard } from './MonthGridCard';
import { useHistoryMonths } from './useHistoryMonths';

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
  const progressEmojis = useProgressEmojis(habit);
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
      <CalendarTabContent
        completedDates={completedDates}
        habit={habit}
        habitColor={habitColor}
        pendingToggleDate={pendingToggleDate}
        yearCaption={months.caption}
        yearRangeLabel={months.rangeLabel}
        onDayPress={onDayPress}
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
      {habit.createdAt ? (
        <ErrorBoundary>
          <HabitStrengthSection
            completedDates={completedDates}
            habitColor={habit.color ?? habit.iconColor}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            habitStrength={habit.strength}
            progressEmojis={progressEmojis}
          />
        </ErrorBoundary>
      ) : null}
      <GoalTabContent habit={habit} />
    </Animated.View>
  );
}
