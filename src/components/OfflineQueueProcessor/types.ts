import type { QueuedSubmission } from '../../hooks/useOfflineQueue';

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
  children?: (
    state: ProcessingState,
    triggerProcess: () => void
  ) => React.ReactNode;
}

export const DEFAULT_MIN_PROCESSING_INTERVAL_MS = 5000;

export const INITIAL_PROCESSING_STATE: ProcessingState = {
  currentItem: null,
  failedCount: 0,
  isProcessing: false,
  processedCount: 0,
  progress: 0,
  totalItems: 0,
};
