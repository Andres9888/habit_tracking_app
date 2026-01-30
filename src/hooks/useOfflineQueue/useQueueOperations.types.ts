/**
 * Types for useQueueOperations
 */

import type { MutableRefObject } from 'react';
import type { QueuedSubmission, QueueStats } from './types';

export interface UseQueueOperationsProps {
  maxQueueSize: number;
  maxRetries: number;
  isMountedRef: MutableRefObject<boolean>;
  setQueueCount: (count: number) => void;
  onItemProcessed?: (item: QueuedSubmission) => void;
  onItemFailed?: (item: QueuedSubmission, error: Error) => void;
  onQueueChange?: (stats: QueueStats) => void;
}
