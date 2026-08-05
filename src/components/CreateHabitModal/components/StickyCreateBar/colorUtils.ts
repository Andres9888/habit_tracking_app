/**
 * Color Utilities for StickyCreateBar
 */

// Default green color for the button when no color is selected
export const DEFAULT_BUTTON_COLOR = '#22C55E';

// Convert a number to a two-character hex string
function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

/**
 * Creates a darker shade of a hex color for gradient effect
 * @param hex - The hex color (e.g., '#22C55E')
 * @param percent - How much darker (0-100), default 20%
 * @returns The darker hex color
 */
export function darkenColor(hex: string, percent: number = 20): string {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = Number.parseInt(color.slice(0, 2), 16);
  const g = Number.parseInt(color.slice(2, 4), 16);
  const b = Number.parseInt(color.slice(4, 6), 16);

  // Calculate darker values
  const darkerR = Math.max(0, Math.floor(r * (1 - percent / 100)));
  const darkerG = Math.max(0, Math.floor(g * (1 - percent / 100)));
  const darkerB = Math.max(0, Math.floor(b * (1 - percent / 100)));

  return `#${toHex(darkerR)}${toHex(darkerG)}${toHex(darkerB)}`;
}

/**
 * Creates a lighter shade of a hex color (mixes toward white) for gradient effect
 * @param hex - The hex color (e.g., '#F59E0B')
 * @param percent - How much lighter (0-100), default 25%
 * @returns The lighter hex color
 */
export function lightenColor(hex: string, percent: number = 25): string {
  const color = hex.replace('#', '');

  const r = Number.parseInt(color.slice(0, 2), 16);
  const g = Number.parseInt(color.slice(2, 4), 16);
  const b = Number.parseInt(color.slice(4, 6), 16);

  const lighterR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  const lighterG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  const lighterB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  return `#${toHex(lighterR)}${toHex(lighterG)}${toHex(lighterB)}`;
}

/**
 * Get gradient colors based on button state
 */
export function getGradientColors(
  disabled: boolean,
  buttonColor: string
): readonly [string, string] {
  if (disabled) {
    return ['#a8a29e', '#78716c'] as const; // Disabled gray gradient
  }
  return [buttonColor, darkenColor(buttonColor, 25)] as const;
}
