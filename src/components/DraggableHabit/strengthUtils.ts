/**
 * Get strength as percentage (0-100) from decimal (0-1)
 */
export function getStrengthPercent(strength: number | undefined): number {
  return (strength ?? 0) * 100;
}

/**
 * Get strength emoji based on percentage (matches StrengthProgressBar levels)
 */
export function getStrengthEmoji(strengthPercent: number): string {
  if (strengthPercent >= 80) return '⚡'; // Automatic
  if (strengthPercent >= 60) return '💪'; // Strong
  if (strengthPercent >= 40) return '🌳'; // Developing
  if (strengthPercent >= 20) return '🌿'; // Building
  return '🌱'; // Starting
}

export function getStrengthLabel(strengthPercent: number): string {
  if (strengthPercent >= 80) return 'Automatic';
  if (strengthPercent >= 60) return 'Strong';
  if (strengthPercent >= 40) return 'Developing';
  if (strengthPercent >= 20) return 'Building';
  return 'Starting';
}
