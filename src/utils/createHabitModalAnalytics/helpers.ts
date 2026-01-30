/**
 * Helper: Get time of day category for smart reminder tracking
 */
export function getTimeOfDay(): 'morning' | 'midday' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 20) return 'midday';
  return 'evening';
}

/**
 * Helper: Get warning level for character counter
 */
export function getCharacterCountWarningLevel(
  count: number
): 'normal' | 'warning' | 'error' {
  if (count > 40) return 'error';
  if (count > 30) return 'warning';
  return 'normal';
}
