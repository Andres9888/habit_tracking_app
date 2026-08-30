import { useCallback, useState } from 'react';

export type DetailRoute =
  | 'detail'
  | 'history'
  | 'analytics'
  | 'day'
  | 'insight';

export type InsightId = 'working' | 'oneFix';

export interface FlowParams {
  focusDate?: string;
  insightId?: InsightId;
}

const TITLES: Record<DetailRoute, string> = {
  analytics: 'Analytics',
  day: 'Entry',
  detail: 'Detail',
  history: 'History',
  insight: 'Insight',
};

export function useDetailFlow() {
  const [route, setRoute] = useState<DetailRoute>('detail');
  const [stack, setStack] = useState<DetailRoute[]>([]);
  const [params, setParams] = useState<FlowParams>({});

  const go = useCallback(
    (next: DetailRoute, nextParams?: FlowParams) => {
      setStack((prev) => [...prev, route]);
      setRoute(next);
      setParams(nextParams ?? {});
    },
    [route]
  );

  const replace = useCallback((next: DetailRoute, nextParams?: FlowParams) => {
    setRoute(next);
    setParams(nextParams ?? {});
  }, []);

  const back = useCallback(() => {
    const nextRoute = stack[stack.length - 1] ?? 'detail';
    setRoute(nextRoute);
    setStack(stack.slice(0, -1));
  }, [stack]);

  const reset = useCallback(() => {
    setRoute('detail');
    setStack([]);
    setParams({});
  }, []);

  const previous = stack[stack.length - 1] ?? 'detail';

  return {
    back,
    backLabel: TITLES[previous],
    go,
    params,
    replace,
    reset,
    route,
    title: TITLES[route],
  };
}
