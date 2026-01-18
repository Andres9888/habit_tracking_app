/**
 * Helper functions for StatsRow Component
 */

/**
 * Generates a lighter shade of a hex color (50-level tint)
 * Used for streak badge background
 */
export function getHabitColor50(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  const blendFactor = 0.9;
  const newR = Math.round(r + (255 - r) * blendFactor);
  const newG = Math.round(g + (255 - g) * blendFactor);
  const newB = Math.round(b + (255 - b) * blendFactor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Formats streak text based on count
 */
export function formatStreakText(currentStreak: number): string {
  return currentStreak === 1 ? '1 day streak' : `${currentStreak} day streak`;
}
