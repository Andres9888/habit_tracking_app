/**
 * Analytics — verdict first, then the evidence.
 *
 * The year grid used to open this page; it moved to History, whose job is "what
 * happened?". Analytics answers "am I improving?", so it opens on a sentence,
 * carries the streak rail people quote about themselves, and closes on the
 * findings the log supports.
 */
import { useMemo, useState } from 'react';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useHabitInsights, useStreakRuns } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import type { InsightId } from '../../useDetailFlow';
import { FlowPage } from '../FlowPage';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { useHistoryMonths } from '../HabitDetailHistory/useHistoryMonths';
import { analyticsInsightRows } from './analyticsInsightRows';
import {
  chartAverageLabel,
  chartFootnote,
  chartSubtitle,
  chartTitle,
} from './chartCopy';
import { InsightRows } from './InsightRows';
import { buildMonthlyBars } from './monthlyBars';
import { buildNextStep } from './nextStep';
import { RangeChart } from './RangeChart';
import { RangeTabs, type ChartRange } from './RangeTabs';
import { StreakRail } from './StreakRail';
import { buildVerdict } from './verdict';
import { VerdictCard } from './VerdictCard';
import { buildWeeklyBars } from './weeklyBars';

interface HabitAnalyticsScreenProps {
  habit: Habit;
  onOpenHistory: (date?: string) => void;
  onOpenInsight: (id: InsightId) => void;
}

export function HabitAnalyticsScreen({
  habit,
  onOpenHistory,
  onOpenInsight,
}: HabitAnalyticsScreenProps) {
  const palette = useInsightPalette();
  const [range, setRange] = useState<ChartRange>('weekly');
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });
  const months = useHistoryMonths({
    completedDates: insights.doneDates,
    daysOfWeek: habit.daysOfWeek,
  });
  const today = getLocalDateString();
  const bars = useMemo(
    () =>
      range === 'weekly'
        ? buildWeeklyBars(insights.doneDates, today)
        : buildMonthlyBars(insights.doneDates, today, habit.daysOfWeek),
    [habit.daysOfWeek, insights.doneDates, range, today]
  );
  const runs = useStreakRuns(insights.doneDates, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
  });
  const verdict = buildVerdict(months.rates);
  const nextStep = buildNextStep(insights, months.rates, today)?.text;

  return (
    <FlowPage footnote='Every number here comes from check-ins you recorded. Nothing is predicted.'>
      {verdict ? (
        <VerdictCard nextStep={nextStep} palette={palette} verdict={verdict} />
      ) : null}
      <StreakRail
        bestStreak={habit.bestStreak ?? 0}
        currentStreak={habit.currentStreak ?? 0}
        daysLogged={insights.yearCompletions}
        goalDuration={habit.goalDuration}
        palette={palette}
      />
      <RangeTabs range={range} onChange={setRange} />
      <RangeChart
        averageLabel={chartAverageLabel(range, bars)}
        bars={bars}
        footnote={chartFootnote(range, bars)}
        scaleMax={range === 'monthly' ? 100 : undefined}
        subtitle={chartSubtitle(range, bars)}
        title={chartTitle(range)}
      />
      <FlowSectionLabel>What the log shows</FlowSectionLabel>
      <InsightRows
        rows={analyticsInsightRows(insights, runs)}
        onOpenHistory={() => onOpenHistory()}
        onOpenInsight={onOpenInsight}
      />
    </FlowPage>
  );
}
