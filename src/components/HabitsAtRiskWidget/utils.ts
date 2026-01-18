/**
 * Get intervention suggestion based on habit strength
 * Lower strength = more intensive intervention needed
 */
export function getInterventionSuggestion(strength: number): string {
  if (strength < 0.3) return 'Needs intensive support';
  if (strength < 0.5) return 'Gentle reminder recommended';
  return 'Quick check-in suggested';
}
