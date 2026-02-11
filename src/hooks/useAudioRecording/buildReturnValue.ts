/**
 * buildReturnValue - Constructs the return value for useAudioRecording
 */

import type { RecordingStatus, UseAudioRecordingReturn } from './types';
import { formatDuration } from './formatUtils';

interface BuildReturnValueParams {
  cancelRecording: () => Promise<void>;
  maxDuration: number;
  openSettings: () => void;
  pauseRecording: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  reset: () => void;
  resumeFromInterruption: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  showPermissionAlert: () => void;
  startRecording: () => Promise<void>;
  status: RecordingStatus;
  stopRecording: () => Promise<string | null>;
}

export function buildReturnValue({
  cancelRecording,
  maxDuration,
  openSettings,
  pauseRecording,
  requestPermission,
  reset,
  resumeFromInterruption,
  resumeRecording,
  showPermissionAlert,
  startRecording,
  status,
  stopRecording,
}: BuildReturnValueParams): UseAudioRecordingReturn {
  return {
    cancelRecording,
    canStartRecording: status.state === 'idle' || status.state === 'stopped',
    formattedDuration: formatDuration(status.durationSeconds),
    isApproachingMaxDuration: status.isApproachingMaxDuration,
    isInterrupted: status.state === 'interrupted',
    isMaxDurationReached: status.durationSeconds >= maxDuration,
    isPaused: status.state === 'paused',
    isRecording: status.state === 'recording',
    openSettings,
    pauseRecording,
    requestPermission,
    reset,
    resumeFromInterruption,
    resumeRecording,
    secondsUntilMaxDuration: status.secondsUntilMaxDuration,
    showPermissionAlert,
    startRecording,
    status,
    stopRecording,
  };
}
