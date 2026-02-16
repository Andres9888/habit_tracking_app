/**
 * Utility functions for StreakRecordsAccordion
 */

/**
 * Format date for display (e.g., "Dec 1")
 */
export function formatDate(dateString: string): string {
  try {
    // Parse YYYY-MM-DD as local date (not UTC) to avoid off-by-one timezone bugs
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}
