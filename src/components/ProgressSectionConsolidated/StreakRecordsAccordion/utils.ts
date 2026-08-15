/**
 * Utility functions for StreakRecordsAccordion
 */

import { formatDateKeyLabel } from '../../../utils/getLocalDateString';

/**
 * Format date for display (e.g., "Dec 1")
 */
export function formatDate(dateString: string): string {
  try {
    return formatDateKeyLabel(dateString, { day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}
