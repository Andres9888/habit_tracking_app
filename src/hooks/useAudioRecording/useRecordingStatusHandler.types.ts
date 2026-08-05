/**
 * Types for useRecordingStatusHandler
 */

import type { RecordingStatus } from './types';

export type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

export interface UseRecordingStatusHandlerOptions {
  maxDurationSeconds: number;
  warningThresholdSeconds: number;
  onMaxDurationReached?: () => void;
  onWarningThresholdReached?: (secondsRemaining: number) => void;
  onInterrupted?: (reason: 'phone-call' | 'other-app' | 'system') => void;
}
