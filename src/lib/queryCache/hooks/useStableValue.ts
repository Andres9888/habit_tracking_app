import { useRef } from 'react';

import { structuralEqual } from '../equality';

// Collapse a content-identical fresh instance back onto the prior reference so
// downstream memo/identity chains (CalendarTimeline props, derived Maps) stay
// stable across a content-equal Convex confirmation. The ref mutation is
// render-cache style — idempotent and tear-free because inputs come from
// useSyncExternalStore / useQuery (in-repo precedent: useTrackingWindow).
//
// Consumers MUST NOT treat the returned identity as an event signal: a genuine
// content change yields a new reference, a content-equal push keeps the old one.
export function useStableValue<T>(value: T): T {
  const ref = useRef(value);
  if (value !== ref.current && !structuralEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}
