/**
 * Utility functions for StreakRecordsAccordion
 */

import { formatShortDate } from '../../../../utils/dateFormat';

/**
 * Format date for display (e.g., "Jan 15")
 */
export function formatDate(dateString: string): string {
  try {
    return formatShortDate(dateString);
  } catch {
    return dateString;
  }
}
