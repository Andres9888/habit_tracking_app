/**
 * useAudioRecording - Audio recording hook with expo-av
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

export { useAudioRecording, default } from './useAudioRecording';
export {
  openMicrophoneSettings,
  showMicrophonePermissionAlert,
} from './permissionUtils';
export { formatDuration } from './formatUtils';
export type {
  RecordingState,
  RecordingStatus,
  UseAudioRecordingOptions,
  UseAudioRecordingReturn,
  InterruptionReason,
} from './types';
