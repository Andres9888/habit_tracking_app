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
  background: '#FAF8F5', // Warm stone background — single source of truth with core.ts
  border: '#E5E2DE',
  cardBg: '#f0eeeb', // Warm stone card — single source of truth with core.ts light.card
  foreground: '#2D2A26',
  neutral: '#C4BFB7',
} as const;

export type WarmPaletteKey = keyof typeof warmPalette;
