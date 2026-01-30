/**
 * OfflineQueueProcessor Component
 * Processes queued submissions when network is restored.
 */

import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useOnlineCallback } from '../../contexts/NetworkStatusContext';
import { useQueueProcessor } from './useQueueProcessor';
import {
  DEFAULT_MIN_PROCESSING_INTERVAL_MS,
  type OfflineQueueProcessorProps,
} from './types';

export function OfflineQueueProcessor({
  autoProcess = true,
  minProcessingIntervalMs = DEFAULT_MIN_PROCESSING_INTERVAL_MS,
  onProcessingStart,
  onProcessingComplete,
  onItemProcessed,
  onItemFailed,
  onStateChange,
  children,
}: OfflineQueueProcessorProps) {
  const onlineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const callbacks = useMemo(
    () => ({
      onItemFailed,
      onItemProcessed,
      onProcessingComplete,
      onProcessingStart,
      onStateChange,
    }),
    [
      onItemFailed,
      onItemProcessed,
      onProcessingComplete,
      onProcessingStart,
      onStateChange,
    ]
  );

  const {
    hasQueuedItems,
    isOnline,
    isProcessingRef,
    processQueue,
    processingState,
  } = useQueueProcessor(minProcessingIntervalMs, callbacks);

  // Auto-process when coming back online
  useOnlineCallback(() => {
    if (autoProcess && hasQueuedItems) {
      // Clear any existing timeout to prevent duplicates
      if (onlineTimeoutRef.current) {
        clearTimeout(onlineTimeoutRef.current);
      }
      onlineTimeoutRef.current = setTimeout(() => void processQueue(), 1000);
    }
  });

  // Cleanup online timeout on unmount
  useEffect(() => {
    return () => {
      if (onlineTimeoutRef.current) {
        clearTimeout(onlineTimeoutRef.current);
      }
    };
  }, []);

  // Periodic check for items ready to retry
  useEffect(() => {
    if (!autoProcess || !isOnline) return;

    const interval = setInterval(() => {
      if (hasQueuedItems && !isProcessingRef.current) {
        void processQueue();
      }
    }, minProcessingIntervalMs * 2);

    return () => clearInterval(interval);
  }, [
    autoProcess,
    isOnline,
    hasQueuedItems,
    minProcessingIntervalMs,
    processQueue,
    isProcessingRef,
  ]);

  const triggerProcessQueue = useCallback(() => {
    void processQueue();
  }, [processQueue]);

  if (children) {
    return <>{children(processingState, triggerProcessQueue)}</>;
  }

  return null;
}

export default OfflineQueueProcessor;
