/**
 * Semantic Color Tokens
 * Frontend Redesign Spec 2026-02-14
 *
 * ## Color Role Separation
 *
 * Our design system uses distinct colors for different semantic purposes:
 *
 * - **Primary/CTA**: Forest green (#059669/#047857) — brand identity, main action buttons
 * - **Success**: Green (#15793C) — checkmarks, task completions, positive confirmations
 * - **Streak/Progress**: Burnished gold (#8B6208) — habit chains, streaks, momentum indicators
 * - **Info**: Blue (#3872B8) — informational messages, help text, neutral notices
 *
 * This separation prevents semantic confusion (e.g., "success" vs "primary action").
 *
 * ## Warm Minimal Aesthetic
 *
 * The warm palette creates an organic, calm feel through earth-toned neutrals.
 * These colors form the foundation for backgrounds, cards, and text.
 */

/**
 * Warm Stone Palette
 *
 * Provides warm, organic neutral tones for the warm-minimal aesthetic.
 * These are the most commonly used colors in the app.
 *
 * @example
 * ```tsx
 * import { warmPalette } from '@/theme/colors';
 *
 * // Background for main screen
 * <View style={{ backgroundColor: warmPalette.background }} />
 *
 * // Card surface
 * <View style={{
 *   backgroundColor: warmPalette.cardBg,
 *   borderColor: warmPalette.border
 * }} />
 *
 * // Text
 * <Text style={{ color: warmPalette.foreground }}>Hello</Text>
 * ```
 */
export const warmPalette = {
  /** Canvas (L0) — warm parchment base for entire app */
  background: '#F5F1ED',

  /** Border color for cards, dividers, separators */
  border: '#DDD8D2',

  /** Surface (L1) — subtle lift for cards and elevated elements */
  cardBg: '#EDEAE5',

  /** Primary text color — high contrast for readability */
  foreground: '#2D2A26',

  /** Neutral disabled/inactive state */
  neutral: '#C4BFB7',
} as const;

export type WarmPaletteKey = keyof typeof warmPalette;
