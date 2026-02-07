/**
 * ProgressBarRow Helpers
 * Gradient color mapping for strength levels
 */

/**
 * Get gradient colors for strength level
 * Creates a richer visual with gradient instead of solid fill
 */
export function getGradientColors(baseColor: string): [string, string, string] {
  const gradientMap: Record<string, [string, string, string]> = {
    // Yellow (Developing)
    '#22c55e': ['#86efac', '#22c55e', '#16a34a'],

    // Green (Strong)
    '#6366f1': ['#a5b4fc', '#6366f1', '#4f46e5'],

    // Orange (Building)
    '#eab308': ['#fde047', '#eab308', '#ca8a04'],

    '#ef4444': ['#fca5a5', '#ef4444', '#dc2626'],
    // Red (Starting)
    '#f97316': ['#fdba74', '#f97316', '#ea580c'], // Indigo (Automatic)
  };
  return gradientMap[baseColor] || [baseColor, baseColor, baseColor];
}
