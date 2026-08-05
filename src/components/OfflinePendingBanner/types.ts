import type { QueueStats } from '../../hooks/useOfflineQueue';
import type { ProcessingState } from '../OfflineQueueProcessor';

/**
 * Props for OfflinePendingBanner
 */
export interface OfflinePendingBannerProps {
  /** Current processing state (if processor is active) */
  processingState?: ProcessingState;
  /** Whether to respect reduce motion preference */
  reduceMotion?: boolean;
  /** Callback when banner is tapped */
  onPress?: () => void;
  /** Callback when "Sync Now" is tapped */
  onSyncPress?: () => void;
  /** Whether to show the sync button */
  showSyncButton?: boolean;
  /** Custom queue stats (for testing) */
  queueStats?: QueueStats;
  /** Whether to show even when online (for testing) */
  forceShow?: boolean;
}
