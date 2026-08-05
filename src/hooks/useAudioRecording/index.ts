/**
 * useAudioRecording - Audio recording hook with expo-audio
 *
 * Story T10.2: Audio recording integration (expo-audio)
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
