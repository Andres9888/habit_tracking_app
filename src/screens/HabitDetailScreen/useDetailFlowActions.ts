import { useMemo } from 'react';
import type { DetailRoute, FlowParams, InsightId } from './useDetailFlow';

type Go = (next: DetailRoute, nextParams?: FlowParams) => void;

export function useDetailFlowActions(go: Go, replace: Go, route: DetailRoute) {
  return useMemo(
    () => ({
      openAnalytics: () => go('analytics'),
      openDay: (date: string) =>
        (route === 'day' ? replace : go)('day', { focusDate: date }),
      openHistory: (date?: string) =>
        go('history', date ? { focusDate: date } : {}),
      openInsight: (id: InsightId) => go('insight', { insightId: id }),
    }),
    [go, replace, route]
  );
}
