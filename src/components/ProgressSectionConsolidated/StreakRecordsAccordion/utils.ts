/**
 * Utility functions for StreakRecordsAccordion
 */

/**
 * Format date for display (e.g., "Dec 1")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}
