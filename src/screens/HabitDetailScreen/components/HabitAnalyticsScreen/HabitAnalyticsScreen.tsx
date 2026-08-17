import { useMemo, useState } from 'react';
import type { Habit } from '../../../../features/habits/types';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import type { InsightId } from '../../useDetailFlow';
import { FlowPage } from '../FlowPage';
import { FlowSectionLabel } from '../FlowSectionLabel';
import { YearGlanceCard } from '../HabitDetailHistory';
import { useHistoryMonths } from '../HabitDetailHistory/useHistoryMonths';
import { analyticsInsightRows } from './analyticsInsightRows';
import { chartSubtitle, chartTitle, YEAR_TAP_CAPTION } from './chartCopy';
import { InsightRows } from './InsightRows';
import { buildMonthlyBars } from './monthlyBars';
import { RangeChart } from './RangeChart';
import { RangeTabs, type ChartRange } from './RangeTabs';
import { buildWeeklyBars } from './weeklyBars';

interface HabitAnalyticsScreenProps {
  habit: Habit;
  onOpenHistory: (date: string) => void;
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
        : buildMonthlyBars(insights.doneDates, today),
    [insights.doneDates, range, today]
  );
  const yearSub = months.rangeLabel
    ? `${months.rangeLabel} · days you logged`
    : 'Days you logged';

  return (
    <FlowPage footnote='Every number here comes from check-ins you recorded. Nothing is predicted.'>
      <YearGlanceCard
        caption={YEAR_TAP_CAPTION}
        completedDates={insights.doneDates}
        habitColor={palette.green}
        habitCreatedAt={habit.createdAt}
        palette={palette}
        rangeLabel={yearSub}
        onNavigateToMonth={onOpenHistory}
      />
      <RangeTabs range={range} onChange={setRange} />
      <RangeChart
        bars={bars}
        subtitle={chartSubtitle(range, bars)}
        title={chartTitle(range)}
      />
      <FlowSectionLabel>What the log shows</FlowSectionLabel>
      <InsightRows
        rows={analyticsInsightRows(insights)}
        onOpenInsight={onOpenInsight}
      />
    </FlowPage>
  );
}
