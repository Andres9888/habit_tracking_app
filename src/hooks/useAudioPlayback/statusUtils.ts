/**
 * useAudioPlayback Status Utilities
 *
 * Type guards and status checking utilities for audio playback.
 */

import type { AudioStatus } from 'expo-audio';

/**
 * Check if status is a success status with required fields
 */
export function isPlaybackStatusSuccess(
  status: AudioStatus
): boolean {
  return status.isLoaded;
}
