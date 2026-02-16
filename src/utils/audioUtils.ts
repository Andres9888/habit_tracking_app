/**
 * Shared audio utility functions
 * Consolidated from multiple duplicate implementations
 */

/**
 * Format seconds as MM:SS
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (MM:SS)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
