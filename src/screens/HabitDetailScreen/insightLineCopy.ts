import type { InsightId } from './useDetailFlow';
import type { HabitInsights } from './insights';

export interface InsightLine {
  id: InsightId;
  text: string;
}

/** One grounded sentence for Detail. Full evidence lives on Analytics. */
export function insightLineCopy(insights: HabitInsights): InsightLine | null {
  if (insights.working) {
    return {
      id: 'working',
      text: `Most of your check-ins happen ${insights.working.daypart.phrase}.`,
    };
  }
  if (insights.oneFix) {
    return {
      id: 'oneFix',
      text: `${insights.oneFix.weakest.plural} are where it slips.`,
    };
  }
  return null;
}
