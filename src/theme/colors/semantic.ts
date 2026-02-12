/**
 * Semantic Color Tokens
 * Extended color groups for specific UI contexts
 */

/**
 * Warm Stone Palette
 * Used by global.css, tailwind.config.js, and HabitCard
 * Provides the warm, inviting neutral tones that distinguish
 * the app from standard cool-gray Tailwind defaults.
 */
export const warmPalette = {
  background: '#faf9f7', // Consolidated: was #FAF8F5, now matches core.ts
  border: '#E5E2DE',
  cardBg: '#ffffff', // Consolidated: was #f0eeeb, now matches light.card
  foreground: '#2D2A26',
  neutral: '#C4BFB7',
} as const;

export type WarmPaletteKey = keyof typeof warmPalette;
