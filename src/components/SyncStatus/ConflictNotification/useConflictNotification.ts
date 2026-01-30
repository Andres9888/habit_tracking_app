/**
 * useConflictNotification Hook
 *
 * Manages visibility state for the ConflictNotification component.
 * In a full integration, this would listen for conflict events from
 * the SyncOrchestrator. For now, it provides manual control.
 *
 * Implements US4 acceptance criteria 2:
 * "Given conflict occurs, When user notified, Then informational only, no action required"
 */

import { useState, useCallback } from 'react';

import type {
  UseConflictNotificationOptions,
  UseConflictNotificationResult,
} from './types';

const DEFAULT_DURATION = 3000;

export function useConflictNotification({
  duration = DEFAULT_DURATION,
  onDismiss,
  enabled = true,
}: UseConflictNotificationOptions = {}): UseConflictNotificationResult {
  const [visible, setVisible] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  const dismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const show = useCallback(
    (count = 1) => {
      if (enabled) {
        setConflictCount(count);
        setVisible(true);
      }
    },
    [enabled]
  );

  return {
    conflictCount,
    dismiss,
    show,
    visible,
  };
}
