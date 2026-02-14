/**
 * Semantic Color Tokens
 * Extended color groups for specific UI contexts
 *
 * Color Role Separation (avoid "green means everything"):
 * - Primary/CTA: Emerald (#059669/#10B981) — brand buttons, main actions
 * - Success: Green-500 (#22c55e) — checkmarks, completions, positive states
 * - Streak/Progress: Amber/Gold (#F59E0B) — chains, streaks, momentum
 * - Strength: Uses its own gradient scale (lime → teal → cyan) in core.ts
 * - Info: Blue (#3B82F6) — informational states
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
