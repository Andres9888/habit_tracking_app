/**
 * Format habit frequency for display as a human-readable subtitle.
 */

const DAY_LABELS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatFrequency(
  frequency?: string,
  daysOfWeek?: number[],
  timesPerWeek?: number,
  everyXDays?: number
): string | null {
  if (!frequency || frequency === 'daily') return null; // Don't show for daily (default)

  if (frequency === 'specific_days' && daysOfWeek?.length) {
    const labels = daysOfWeek
      .slice()
      .sort((a, b) => a - b)
      .map((d) => DAY_LABELS_SHORT[d]);
    return labels.join(', ');
  }

  if (frequency === 'times_per_week' && timesPerWeek) {
    return `${timesPerWeek}x per week`;
  }

  if (frequency === 'every_x_days' && everyXDays) {
    return `Every ${everyXDays} days`;
  }

  return null;
}
