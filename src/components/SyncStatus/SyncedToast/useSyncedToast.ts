/**
 * useSyncedToast Hook
 *
 * Bridges the SyncStatusContext with the SyncedToast component.
 * Listens for sync completion events and manages toast visibility.
 *
 * Implements US3 acceptance criteria 3:
 * "Given sync completes, When done, Then pending indicators disappear, brief 'Synced' confirmation"
 */

import { useState, useCallback } from 'react';

import { useOnSyncComplete } from '../../../contexts/SyncStatusContext/hooks';
import type { SyncOrchestratorResult } from '../../../lib/offline/sync/types';
import type { UseSyncedToastOptions, UseSyncedToastResult } from './types';

const DEFAULT_DURATION = 2000;

export function useSyncedToast({
  duration = DEFAULT_DURATION,
  onDismiss,
  enabled = true,
}: UseSyncedToastOptions = {}): UseSyncedToastResult {
  const [visible, setVisible] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const handleSyncComplete = useCallback(
    (result: SyncOrchestratorResult) => {
      // Only show toast if operations were actually synced
      if (enabled && result.succeeded > 0) {
        setSyncedCount(result.succeeded);
        setVisible(true);
      }
    },
    [enabled]
  );

  // Register for sync completion events
  useOnSyncComplete(handleSyncComplete);

  const dismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const show = useCallback((count = 1) => {
    setSyncedCount(count);
    setVisible(true);
  }, []);

  return {
    dismiss,
    show,
    syncedCount,
    visible,
  };
}
