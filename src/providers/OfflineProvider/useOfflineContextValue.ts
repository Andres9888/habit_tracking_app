import { useMemo } from 'react';

import type { OfflineContextValue } from './types';

export function useOfflineContextValue(
  value: OfflineContextValue
): OfflineContextValue {
  return useMemo(
    () => value,
    [value.isRestored, value.isRestoring, value.restorationError, value.restoreQueue]
  );
}
