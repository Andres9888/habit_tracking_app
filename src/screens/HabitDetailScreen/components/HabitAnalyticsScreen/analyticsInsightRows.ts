import { oneFixBody } from '../NoticingSection';
import type { InsightId } from '../../useDetailFlow';
import { runTrend, type HabitInsights, type StreakRun } from '../../insights';

/**
 * "streakTrend" is not an insight-detail route: its evidence is the runs rail
 * on History, so the row navigates there instead.
 */
export type AnalyticsRowId = InsightId | 'streakTrend';

export interface AnalyticsInsightRow {
  id: AnalyticsRowId;
  subtitle: string;
  title: string;
}

/** Tappable insight list for Analytics. Empty when no pattern is ready. */
export function analyticsInsightRows(
  insights: HabitInsights,
  runs: readonly StreakRun[] = []
): AnalyticsInsightRow[] {
  const rows: AnalyticsInsightRow[] = [];
  if (insights.working) {
    rows.push({
      id: 'working',
      subtitle: `${insights.working.sharePct}% of ${insights.working.sample} check-ins`,
      title: `Wins land ${insights.working.daypart.phrase}`,
    });
  }
  if (insights.oneFix) {
    rows.push({
      id: 'oneFix',
      subtitle: oneFixBody(insights.oneFix),
      title: `${insights.oneFix.weakest.plural} are where it slips`,
    });
  }
  const trend = runTrend(runs);
  if (trend?.improving) {
    rows.push({
      id: 'streakTrend',
      subtitle: `Average run: ${trend.earlierAvg} days early on → ${trend.recentAvg} since`,
      title: 'Streaks are getting longer',
    });
  }
  return rows;
}
