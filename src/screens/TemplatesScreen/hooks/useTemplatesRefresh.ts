/**
 * Pull-to-refresh hook for templates screen
 * Convex queries auto-refresh, so this provides visual feedback only
 */

import { useCallback, useState } from 'react';

const REFRESH_DURATION_MS = 1000;

export function useTemplatesRefresh() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries automatically refresh — this is a visual indicator
    setTimeout(() => setRefreshing(false), REFRESH_DURATION_MS);
  }, []);

  return { refreshing, onRefresh };
}
