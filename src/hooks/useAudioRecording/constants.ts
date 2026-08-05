/**
 * Constants for audio recording
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import {
  AudioQuality,
  IOSOutputFormat,
  type RecordingOptions,
} from 'expo-audio';

/**
 * Recording quality preset optimized for voice notes
 * Uses AAC codec with reasonable quality settings for file size vs quality balance
 */
export const RECORDING_OPTIONS: RecordingOptions = {
  android: {
    audioEncoder: 'aac',
    outputFormat: 'mpeg4',
  },
  bitRate: 128_000,
  extension: '.m4a',
  isMeteringEnabled: true,
  ios: {
    audioQuality: AudioQuality.HIGH,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    outputFormat: IOSOutputFormat.MPEG4AAC,
  },
  numberOfChannels: 1,
  sampleRate: 44_100,
  web: {
    bitsPerSecond: 128_000,
    mimeType: 'audio/webm',
  },
};

/**
 * Maximum recording duration in seconds (5 minutes as per spec)
 */
export const MAX_RECORDING_DURATION_SECONDS = 300;

/**
 * Default warning threshold in seconds before max duration
 * Shows warning 30 seconds before max is reached
 */
export const DEFAULT_WARNING_THRESHOLD_SECONDS = 30;

/**
 * Recording status update interval in milliseconds
 */
export const STATUS_UPDATE_INTERVAL_MS = 100;

/**
 * Initial recording status state
 */
export const INITIAL_RECORDING_STATUS = {
  canAskAgain: true,
  durationSeconds: 0,
  errorMessage: null,
  hasPermission: null,
  interruptionReason: null,
  isApproachingMaxDuration: false,
  meteringLevel: 0,
  recordingUri: null,
  secondsUntilMaxDuration: null,
  state: 'idle' as const,
  wasInterrupted: false,
};
