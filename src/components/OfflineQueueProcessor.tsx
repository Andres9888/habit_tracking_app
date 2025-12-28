/**
 * OfflineQueueProcessor Component
 * Processes queued submissions when network is restored
 *
 * Part of Edge Case handling: Offline Queue for Submissions
 *
 * Features:
 * - Automatic processing when coming back online
 * - Configurable processing interval
 * - Type-specific submission handlers
 * - Progress tracking and callbacks
 * - Graceful error handling with retry
 */

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNetworkStatus, useOnlineCallback } from '../contexts/NetworkStatusContext';
import {
  AffirmationPayload,
  HabitUpdatePayload,
  LetterPayload,
  QueuedSubmission,
  ReflectionPayload,
  useOfflineQueue,
} from '../hooks/useOfflineQueue';

/**
 * Processing state for UI feedback
 */
export interface ProcessingState {
  /** Whether processing is currently running */
  isProcessing: boolean;
  /** Current item being processed (if any) */
  currentItem: QueuedSubmission | null;
  /** Total items in queue when processing started */
  totalItems: number;
  /** Items successfully processed so far */
  processedCount: number;
  /** Items that failed this round */
  failedCount: number;
  /** Processing progress (0-1) */
  progress: number;
}

/**
 * Props for OfflineQueueProcessor
 */
export interface OfflineQueueProcessorProps {
  /** Whether to enable automatic processing (default: true) */
  autoProcess?: boolean;
  /** Minimum interval between processing cycles in ms (default: 5000) */
  minProcessingIntervalMs?: number;
  /** Callback when processing starts */
  onProcessingStart?: () => void;
  /** Callback when processing completes */
  onProcessingComplete?: (processed: number, failed: number) => void;
  /** Callback when an item is processed */
  onItemProcessed?: (item: QueuedSubmission) => void;
  /** Callback when an item fails */
  onItemFailed?: (item: QueuedSubmission, error: Error) => void;
  /** Callback for processing state changes */
  onStateChange?: (state: ProcessingState) => void;
  /** Optional render prop for custom UI */
  children?: (state: ProcessingState, triggerProcess: () => void) => React.ReactNode;
}

// Default processing interval
const DEFAULT_MIN_PROCESSING_INTERVAL_MS = 5000;

/**
 * OfflineQueueProcessor Component
 *
 * Renders nothing by default but processes the offline queue in the background.
 * Can optionally render custom UI via children render prop.
 *
 * @example
 * ```tsx
 * // Basic usage - invisible background processor
 * <OfflineQueueProcessor
 *   onProcessingComplete={(processed, failed) => {
 *     if (processed > 0) {
 *       showToast(`Synced ${processed} items`);
 *     }
 *   }}
 * />
 *
 * // With custom UI
 * <OfflineQueueProcessor>
 *   {(state, triggerProcess) => (
 *     <View>
 *       {state.isProcessing && <Text>Syncing...</Text>}
 *       <Button onPress={triggerProcess}>Sync Now</Button>
 *     </View>
 *   )}
 * </OfflineQueueProcessor>
 * ```
 */
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
  const { isOnline } = useNetworkStatus();
  const {
    getRetryableItems,
    dequeue,
    markFailed,
    hasQueuedItems,
  } = useOfflineQueue();

  // Mutations for each submission type
  const upsertReflection = useMutation(api.reflections.upsert);
  const createLetter = useMutation(api.letters.create);
  const createAffirmation = useMutation(api.affirmations.create);
  const updateHabit = useMutation(api.habits.updateHabit);

  // Processing state
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    currentItem: null,
    totalItems: 0,
    processedCount: 0,
    failedCount: 0,
    progress: 0,
  });

  // Refs for processing control
  const isProcessingRef = useRef(false);
  const lastProcessTimeRef = useRef(0);

  // Update processing state and notify
  const updateState = useCallback(
    (updates: Partial<ProcessingState>) => {
      setProcessingState((prev) => {
        const newState = { ...prev, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Process a single item based on its type
  const processItem = useCallback(
    async (item: QueuedSubmission): Promise<boolean> => {
      try {
        switch (item.type) {
          case 'reflection': {
            const payload = item.payload as ReflectionPayload;
            await upsertReflection({
              habitId: payload.habitId as never,
              date: payload.date,
              emoji: payload.emoji,
              note: payload.note,
            });
            return true;
          }

          case 'letter': {
            const payload = item.payload as LetterPayload;
            await createLetter({
              habitId: payload.habitId as never,
              content: payload.content,
              unlockDays: payload.unlockDays,
              title: payload.title,
            });
            return true;
          }

          case 'affirmation': {
            const payload = item.payload as AffirmationPayload;
            await createAffirmation({
              habitId: payload.habitId as never,
              text: payload.text,
              type: payload.type,
            });
            return true;
          }

          case 'habitUpdate': {
            const payload = item.payload as HabitUpdatePayload;
            await updateHabit({
              habitId: payload.habitId as never,
              ...payload.updates,
            });
            return true;
          }

          // Voice notes and vision board images require special handling
          // because they involve file uploads that may have expired URLs
          case 'voiceNote':
          case 'visionBoardImage':
            console.warn(
              `${item.type} offline sync not yet implemented - requires file re-upload`
            );
            return false;

          default: {
            const _exhaustiveCheck: never = item.type;
            console.warn(`Unknown submission type: ${_exhaustiveCheck as string}`);
            return false;
          }
        }
      } catch (error) {
        console.warn(`Failed to process ${item.type}:`, error);
        throw error;
      }
    },
    [upsertReflection, createLetter, createAffirmation, updateHabit]
  );

  // Main processing function
  const processQueue = useCallback(async () => {
    // Prevent concurrent processing
    if (isProcessingRef.current) return;

    // Check minimum interval
    const now = Date.now();
    if (now - lastProcessTimeRef.current < minProcessingIntervalMs) return;

    // Check if online
    if (!isOnline) return;

    // Get items ready for retry
    const items = await getRetryableItems();
    if (items.length === 0) return;

    // Start processing
    isProcessingRef.current = true;
    lastProcessTimeRef.current = now;

    updateState({
      isProcessing: true,
      totalItems: items.length,
      processedCount: 0,
      failedCount: 0,
      progress: 0,
    });

    onProcessingStart?.();

    let processedCount = 0;
    let failedCount = 0;

    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if still online before each item
      if (!isOnline) {
        break;
      }

      updateState({
        currentItem: item,
        progress: i / items.length,
      });

      try {
        const success = await processItem(item);

        if (success) {
          await dequeue(item.id);
          processedCount++;
          onItemProcessed?.(item);
        } else {
          await markFailed(item.id, 'Processing not supported');
          failedCount++;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        await markFailed(item.id, errorMessage);
        failedCount++;
        onItemFailed?.(item, error as Error);
      }
    }

    // Complete processing
    updateState({
      isProcessing: false,
      currentItem: null,
      processedCount,
      failedCount,
      progress: 1,
    });

    isProcessingRef.current = false;
    onProcessingComplete?.(processedCount, failedCount);
  }, [
    isOnline,
    minProcessingIntervalMs,
    getRetryableItems,
    processItem,
    dequeue,
    markFailed,
    updateState,
    onProcessingStart,
    onProcessingComplete,
    onItemProcessed,
    onItemFailed,
  ]);

  // Auto-process when coming back online
  useOnlineCallback(() => {
    if (autoProcess && hasQueuedItems) {
      // Small delay to ensure network is stable
      setTimeout(() => void processQueue(), 1000);
    }
  });

  // Periodic check for items ready to retry (for items that failed previously)
  useEffect(() => {
    if (!autoProcess || !isOnline) return;

    const interval = setInterval(() => {
      if (hasQueuedItems && !isProcessingRef.current) {
        void processQueue();
      }
    }, minProcessingIntervalMs * 2);

    return () => clearInterval(interval);
  }, [autoProcess, isOnline, hasQueuedItems, minProcessingIntervalMs, processQueue]);

  // Wrapper for children render prop
  const triggerProcessQueue = useCallback(() => {
    void processQueue();
  }, [processQueue]);

  // Render children with state and trigger function
  if (children) {
    return <>{children(processingState, triggerProcessQueue)}</>;
  }

  // Default: render nothing (invisible processor)
  return null;
}

export default OfflineQueueProcessor;
