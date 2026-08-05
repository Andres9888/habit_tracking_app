/**
 * useAudioPlayback Status Utilities
 *
 * Type guards and status checking utilities for audio playback.
 */

import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

/**
 * Check if status is a success status with required fields
 */
export function isPlaybackStatusSuccess(
  status: AVPlaybackStatus
): status is AVPlaybackStatusSuccess {
  return status.isLoaded;
}
