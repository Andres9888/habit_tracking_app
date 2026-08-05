/**
 * Helper functions for MonthLabelsRow Component
 */

/** Get full month name from abbreviated label for accessibility */
export function getFullMonthName(abbreviation: string): string {
  const monthMap: Record<string, string> = {
    Apr: 'April',
    Aug: 'August',
    Dec: 'December',
    Feb: 'February',
    Jan: 'January',
    Jul: 'July',
    Jun: 'June',
    Mar: 'March',
    May: 'May',
    Nov: 'November',
    Oct: 'October',
    Sep: 'September',
  };

  return monthMap[abbreviation] || abbreviation;
}
