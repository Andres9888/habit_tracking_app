/* eslint-disable max-lines */
import { useCallback, useRef, useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { executeQueueProcessing } from './processQueue';
import type { Mutations } from './processItem';
import {
  INITIAL_PROCESSING_STATE,
  type ProcessingState,
  type OfflineQueueProcessorProps,
} from './types';

type ProcessorCallbacks = Pick<
  OfflineQueueProcessorProps,
  | 'onProcessingStart'
  | 'onProcessingComplete'
  | 'onItemProcessed'
  | 'onItemFailed'
  | 'onStateChange'
>;

export function useQueueProcessor(
  minProcessingIntervalMs: number,
  callbacks: ProcessorCallbacks
) {
  const { isOnline } = useNetworkStatus();
  const { getRetryableItems, dequeue, markFailed, hasQueuedItems } =
    useOfflineQueue();

  const updateHabit = useMutation(api.habits.update);

  const [processingState, setProcessingState] = useState<ProcessingState>(
    INITIAL_PROCESSING_STATE
  );

  const isProcessingRef = useRef(false);
  const lastProcessTimeRef = useRef(0);

  const mutations = useMemo(
    () =>
      ({
        updateHabit,
      }) as Mutations,
    [updateHabit]
  );

  const updateState = useCallback(
    (updates: Partial<ProcessingState>) => {
      setProcessingState((prev) => {
        const newState = { ...prev, ...updates };
        callbacks.onStateChange?.(newState);
        return newState;
      });
    },
    [callbacks]
  );

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current) return;

    const now = Date.now();
    if (now - lastProcessTimeRef.current < minProcessingIntervalMs) return;
    if (!isOnline) return;

    const items = await getRetryableItems();
    if (items.length === 0) return;

    isProcessingRef.current = true;
    lastProcessTimeRef.current = now;

    updateState({
      failedCount: 0,
      isProcessing: true,
      processedCount: 0,
      progress: 0,
      totalItems: items.length,
    });

    const { processedCount, failedCount } = await executeQueueProcessing({
      callbacks,
      isOnline,
      items,
      mutations,
      operations: { dequeue, markFailed },
      updateState,
    });

    updateState({
      currentItem: null,
      failedCount,
      isProcessing: false,
      processedCount,
      progress: 1,
    });

    isProcessingRef.current = false;
    callbacks.onProcessingComplete?.(processedCount, failedCount);
  }, [
    isOnline,
    minProcessingIntervalMs,
    getRetryableItems,
    dequeue,
    markFailed,
    updateState,
    callbacks,
    mutations,
  ]);

  return {
    hasQueuedItems,
    isOnline,
    isProcessingRef,
    processingState,
    processQueue,
  };
}
