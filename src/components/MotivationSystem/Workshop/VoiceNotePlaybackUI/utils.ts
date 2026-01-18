/**
 * Utility functions for VoiceNotePlaybackUI
 */

/**
 * Format initial duration (in seconds) before audio is loaded
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1:30")
 */
export function formatInitialDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
