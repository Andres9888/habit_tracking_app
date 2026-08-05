/**
 * useAudioPlayback - Audio playback hook with expo-av
 *
 * Story T10.4: Playback UI with progress bar
 */

export { useAudioPlayback, default } from './useAudioPlayback';
export { formatDuration } from './formatUtils';
export {
  PLAYBACK_SPEEDS,
  type PlaybackSpeed,
  type PlaybackState,
  type PlaybackStatus,
  type UseAudioPlaybackReturn,
  type InterruptionReason,
} from './types';
