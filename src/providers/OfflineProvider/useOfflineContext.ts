/**
 * useOfflineContext Hook
 *
 * Hook to access the offline provider context.
 */

import { useContext } from 'react';
import { OfflineContext } from './OfflineProvider';
import type { OfflineContextValue } from './types';

/**
 * Hook to access the offline queue restoration context.
 * Throws if used outside of OfflineProvider.
 */
export function useOfflineContext(): OfflineContextValue {
  const context = useContext(OfflineContext);

  if (!context) {
    throw new Error('UseOfflineContext must be used within an OfflineProvider');
  }

  return context;
}
