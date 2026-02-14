/**
 * Semantic Color Tokens
 * Frontend Redesign Spec 2026-02-14
 *
 * Color Role Separation:
 * - Primary/CTA: Forest green (#22805A/#1B6B4A) — brand buttons, main actions
 * - Success: Green-500 (#22c55e) — checkmarks, completions, positive states
 * - Streak/Progress: Burnished gold (#C4890A) — chains, streaks, momentum
 * - Info: Blue (#3872B8) — informational states
 */

/**
 * Warm Stone Palette
 * Provides warm, organic neutral tones for the warm-minimal aesthetic.
 */
export const warmPalette = {
  background: '#F5F1ED', // Canvas (L0) — warm parchment
  border: '#DDD8D2',
  cardBg: '#EDEAE5', // Surface (L1) — subtle lift
  foreground: '#2D2A26', // Primary text
  neutral: '#C4BFB7',
} as const;

export type WarmPaletteKey = keyof typeof warmPalette;
