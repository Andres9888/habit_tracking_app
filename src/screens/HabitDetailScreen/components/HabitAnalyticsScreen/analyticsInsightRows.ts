import { oneFixBody } from '../NoticingSection';
import type { InsightId } from '../../useDetailFlow';
import type { HabitInsights } from '../../insights';

export interface AnalyticsInsightRow {
  id: InsightId;
  subtitle: string;
  title: string;
}

/** Tappable insight list for Analytics. Empty when no pattern is ready. */
export function analyticsInsightRows(
  insights: HabitInsights
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
  return rows;
}
