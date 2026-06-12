import { useQuery } from 'convex/react';
import { useRef } from 'react';

/**
 * Drop-in replacement for useQuery that keeps the last resolved result while
 * new args are loading, avoiding UI flashes when query parameters change.
 */
export const useStableQuery = ((query, ...args) => {
  const result = useQuery(query, ...args);
  const stored = useRef(result);

  if (result !== undefined) {
    stored.current = result;
  }

  return stored.current;
}) as typeof useQuery;
