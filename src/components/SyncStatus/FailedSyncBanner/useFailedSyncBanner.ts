/**
 * useFailedSyncBanner Hook
 *
 * Bridges the SyncStatusContext to the FailedSyncBanner component: derives
 * visibility from the failed-operation count, guards Retry against double-tap,
 * and confirms Discard behind a native alert.
 */

import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { useSyncStatus } from '../../../contexts/SyncStatusContext';
import type { UseFailedSyncBannerResult } from './types';

export function useFailedSyncBanner(): UseFailedSyncBannerResult {
  const { status, retryFailed, discardFailed } = useSyncStatus();
  const { failedCount, isSyncing } = status;
  const [isRetrying, setIsRetrying] = useState(false);
  const retryingRef = useRef(false);

  const handleRetry = useCallback(() => {
    if (retryingRef.current) return; // guard double-tap
    retryingRef.current = true;
    setIsRetrying(true);
    void Promise.resolve(retryFailed()).finally(() => {
      retryingRef.current = false;
      setIsRetrying(false);
    });
  }, [retryFailed]);

  const handleDiscard = useCallback(() => {
    Alert.alert(
      'Discard changes?',
      'These changes will be permanently removed and won’t sync.',
      [
        { style: 'cancel', text: 'Keep' },
        { onPress: discardFailed, style: 'destructive', text: 'Discard' },
      ]
    );
  }, [discardFailed]);

  return {
    failedCount,
    handleDiscard,
    handleRetry,
    isRetrying,
    visible: failedCount > 0 && !isSyncing,
  };
}
