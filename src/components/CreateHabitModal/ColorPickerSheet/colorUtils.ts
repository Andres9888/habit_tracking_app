import { COLOR_NAMES } from './colorNames';

/**
 * Parse RGB values from a hex color string
 */
function parseHexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    b: Number.parseInt(hex.slice(5, 7), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    r: Number.parseInt(hex.slice(1, 3), 16),
  };
}

/**
 * Calculate HSL lightness from RGB values
 */
function calculateLightness(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return (max + min) / 2 / 255;
}

/**
 * Calculate hue from RGB values (returns value in degrees 0-360)
 */
function calculateHue(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  if (max === min) return 0; // Achromatic

  const d = max - min;
  let h = 0;

  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return h * 360;
}

/**
 * Get color name based on hue angle
 */
function getHueBasedColorName(hue: number, lightPrefix: string): string {
  if (hue < 15 || hue >= 345) return `${lightPrefix}Red`;
  if (hue < 45) return `${lightPrefix}Orange`;
  if (hue < 75) return `${lightPrefix}Yellow`;
  if (hue < 150) return `${lightPrefix}Green`;
  if (hue < 210) return `${lightPrefix}Cyan`;
  if (hue < 270) return `${lightPrefix}Blue`;
  if (hue < 315) return `${lightPrefix}Purple`;
  return `${lightPrefix}Pink`;
}

/**
 * Get a human-readable color name from a hex value
 * Used for accessibility screen reader announcements
 */
export function getColorName(hex: string): string {
  // Check for exact match (case-insensitive)
  const upperHex = hex.toUpperCase();
  if (COLOR_NAMES[upperHex]) {
    return COLOR_NAMES[upperHex];
  }

  // Parse hex to get approximate color name based on hue
  const { r, g, b } = parseHexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = calculateLightness(r, g, b);

  // Handle achromatic (gray scale)
  if (max === min) {
    if (l < 0.2) return 'Dark Gray';
    if (l > 0.8) return 'Light Gray';
    return 'Gray';
  }

  const hue = calculateHue(r, g, b);
  const lightPrefix = l > 0.7 ? 'Light ' : l < 0.3 ? 'Dark ' : '';

  return getHueBasedColorName(hue, lightPrefix);
}
