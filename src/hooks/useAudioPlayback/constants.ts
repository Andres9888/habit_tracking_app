/**
 * useAudioPlayback Constants
 *
 * Configuration values for audio playback.
 */

import type { PlaybackStatus } from './types';

/**
 * Status update interval in milliseconds for smooth progress bar updates
 */
export const STATUS_UPDATE_INTERVAL_MS = 100;

/**
 * Default seek step in seconds
 */
export const DEFAULT_SEEK_STEP_SECONDS = 10;

/**
 * Initial playback status
 */
export const INITIAL_PLAYBACK_STATUS: PlaybackStatus = {
  audioUri: null,
  didJustFinish: false,
  durationSeconds: 0,
  errorMessage: null,
  interruptionReason: null,
  isMuted: false,
  positionSeconds: 0,
  progress: 0,
  speed: 1,
  state: 'idle',
  wasInterrupted: false,
};
