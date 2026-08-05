/**
 * Core Color Palette - Habit Tracking App
 * Frontend Redesign Spec 2026-02-14
 *
 * ## Design Philosophy
 *
 * **Warm Minimal** — earth-toned, restrained, organic aesthetic
 * - **Single saturated color**: Forest green (primary.600 #059669)
 * - **Neutral foundation**: Warm stone grays (#F5F1ED → #1A1816)
 * - **Accent sparingly**: Burnished gold streak color (≤10% visible area)
 * - **WCAG 2.1 Level AA compliant** for all text/background combinations
 *
 * ## Color Naming Convention
 *
 * ### Scale Numbers (50-900)
 * - **50**: Lightest shade — muted surfaces, subtle backgrounds
 * - **100-200**: Light shades — backgrounds, cards, borders
 * - **300-400**: Medium shades — disabled states, hints
 * - **500-600**: Base shades — primary usage, buttons, CTAs
 * - **700-900**: Dark shades — text, headings, high contrast
 *
 * ### Semantic Prefixes
 * - `primary.*`: Forest green brand color
 * - `gray.*`: Warm stone neutrals
 * - `streak.*`: Burnished gold for momentum
 * - `strength.*`: Habit progress levels
 * - `premium.*`: Subscription tier purple
 *
 * ### Suffixes
 * - `Light`: Tinted background (e.g., `errorLight`, `warningLight`)
 * - No suffix: Primary usage
 *
 * @example
 * ```tsx
 * import { colors } from '@/theme/colors';
 *
 * // Buttons use primary.600
 * <Button backgroundColor={colors.primary[600]} />
 *
 * // Text on colored surfaces uses primary.700 (higher contrast)
 * <Text color={colors.primary[700]}>Forest Green Text</Text>
 *
 * // Backgrounds use light.background
 * <View style={{ backgroundColor: colors.light.background }} />
 *
 * // Cards use light.card with borders
 * <View style={{
 *   backgroundColor: colors.light.card,
 *   borderColor: colors.border
 * }} />
 * ```
 */

export const colors = {
  // Convenience aliases (light mode defaults)
  background: '#F5F1ED',

  border: '#DDD8D2',

  // Dark Mode (Future)
  dark: {
    background: '#111827',
    card: '#374151',
    surface: '#1F2937',
  },

  error: '#B53030', // WCAG AA 5.45:1 on #F5F1ED
  errorLight: '#FEE2E2', // Light error tint for badges/backgrounds

  // Neutral Grays (warm stone-based)
  gray: {
    50: '#FAF8F5', // Muted surfaces
    100: '#F5F1ED', // Background
    200: '#DDD8D2', // Borders, dividers
    300: '#C4BFB7', // Disabled elements (WCAG-exempt per 1.4.3)
    400: '#6E6660', // Hint text, tertiary — WCAG AA 4.69:1 on card
    500: '#6B6560', // Secondary text (5.1:1 on #F5F1ED)
    600: '#524D47', // Body text
    700: '#3D3833', // Headings
    800: '#2D2A26', // Primary text
    900: '#1A1816', // Pure black alternative
  },

  // Indigo Colors (Premium surfaces on dark backgrounds)
  indigo: {
    200: '#cbd5f5',
    300: '#a5b4fc',
    600: '#4f46e5',
    700: '#6d28d9',
    900: '#312e81',
  },

  info: '#3872B8',

  // Background & Surfaces (layered planes)
  light: {
    background: '#F5F1ED', // Canvas (L0) — warm parchment
    card: '#EDEAE5', // Surface (L1) — subtle lift
    gradientMid: '#F0EDE8', // Depth gradient midpoint
    surface: '#EDEAE5', // Elevated elements (L1)
    surfaceMuted: '#FAF8F5', // Subtle section differentiation
  },

  // Premium Colors
  premium: {
    400: '#7B52C4', // WCAG AA 5.46:1 with white text
    500: '#8563C7',
    600: '#6D3AC7',
    700: '#5A2DA8',
  },

  // Primary Colors (Forest Green — single saturated color)
  // Design system: #047857 (text), #059669 (buttons)
  primary: {
    100: '#D1FAE5', // Light tinted backgrounds
    300: '#6EE7B7', // Decorative, confetti
    400: '#34D399', // Lighter, hover states
    500: '#10B981', // Success indicators, focus rings
    600: '#059669', // Buttons, CTA fills
    700: '#047857', // High-contrast text on colored surfaces
  },

  // Secondary Colors (Trust & Calm)
  secondary: {
    100: '#dbeafe',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Streak & Progress — burnished gold (accent, ≤10% visible area)
  streak: {
    100: '#FEF3CD', // Streak background tint
    300: '#E8B94D', // Light gold accents
    500: '#8B6208', // Primary streak color — WCAG AA 4.92:1 on streak.100
    600: '#936A08', // Streak badges, flames — WCAG AA 4.88:1 with white
    700: '#7D5907', // Dark gold, high-contrast text — WCAG AA 6.36:1 with white
  },

  /**
   * Habit Strength Level Colors
   *
   * Maps to habit formation stages based on completion percentage.
   * Each level has a base color + light tinted background variant.
   *
   * Progression stages:
   * - **Starting** (0-20%): Lime green — early momentum
   * - **Developing** (20-40%): Teal — gaining traction
   * - **Building** (40-60%): Green — steady progress
   * - **Strong** (60-80%): Cyan — well-established
   * - **Automatic** (80-100%): Forest green — ingrained habit (matches primary.600)
   *
   * All color/background pairs meet WCAG AA contrast requirements.
   *
   * @example
   * ```tsx
   * import { colors } from '@/theme/colors';
   *
   * const getStrengthColor = (percentage: number) => {
   *   if (percentage >= 80) return colors.strength.automatic;
   *   if (percentage >= 60) return colors.strength.strong;
   *   if (percentage >= 40) return colors.strength.building;
   *   if (percentage >= 20) return colors.strength.developing;
   *   return colors.strength.starting;
   * };
   *
   * <ProgressRing
   *   color={colors.strength.building}
   *   backgroundColor={colors.strength.buildingLight}
   * />
   * ```
   */
  strength: {
    automatic: '#059669', // 80-100% — matches primary.600
    automaticLight: '#D4F0E2',
    building: '#16a34a',
    buildingLight: '#dcfce7',
    developing: '#0d9488',
    developingLight: '#ccfbf1',
    starting: '#4D7A0A', // WCAG AA 4.72:1 on startingLight
    startingLight: '#ecfccb',
    strong: '#0891b2',
    strongLight: '#cffafe',
  },

  success: '#15793C', // WCAG AA 4.88:1 on #F5F1ED

  // Semantic text aliases consumed across app components
  text: {
    inverse: '#FFFFFF',
    primary: '#2D2A26',
    secondary: '#6B6560',
    tertiary: '#6E6660', // WCAG AA 5.01:1 on #F5F1ED, 4.69:1 on card
  },

  surface: '#EDEAE5',

  warning: '#9A5504', // WCAG AA 5.08:1 on #F5F1ED
  warningLight: '#FEF3CD',

  /**
   * Parchment palette — warm aged-paper tones for motivation surfaces.
   * Used by HabitWhyBenefitsCard and similar "why are you doing this" callouts.
   * When dark mode is unlocked, define a parchment.dark variant.
   */
  parchment: {
    bg: '#FFF5E8', // Surface background
    border: '#FED7AA', // Subtle border
    surface: '#FFFFFF', // Inner card / icon backplate
    text: '#B45309', // Label / accent text
    textStrong: '#44312A', // Body text on parchment
  },

  /**
   * Tone palettes — semantic encouragement tones for GoalCoachLine and
   * similar contextual messaging. Each tone has bg/border/text triplet.
   */
  tone: {
    green: { bg: '#E7F6EE', border: '#A7D9BE', text: '#0F5E2C' }, // success / done
    orange: { bg: '#FFE8DE', border: '#F9B894', text: '#7A2E0A' }, // warmth / encouragement
    red: { bg: '#FFF1EE', border: '#FCD7CD', text: '#9A2C1A' }, // reset / setback
    yellow: { bg: '#FFF8EE', border: '#FDE4BD', text: '#7C3F0A' }, // default / neutral coaching
  },

  /**
   * Material tier palette — chain visualization progression colors.
   * Used by HabitChainVisualizer/materialTier.ts. Other behavior (shadow
   * opacity, glow, animation) stays in materialTier.ts; this namespace
   * holds only the color values so they're tokenizable / dark-mode ready.
   */
  material: {
    copper: {
      tier: '#B87333', // Tier base color
      icon: '#FEF3C7', // Icon-on-tier color (warm cream)
      shadow: '#B87333', // Cell shadow tint
    },
    gold: {
      tier: '#D4A23F',
      icon: '#78350F', // Dark amber for legibility
      shadow: '#F2B84B', // Bright gold glow
    },
    legendary: {
      tier: '#F2B84B',
      icon: '#78350F',
      shadow: '#F2B84B',
      cellBackground: '#E5E7EB', // Platinum cell base
    },
    iconOnAccent: '#FFFFFF', // Used by `chain` and `iron` tiers (which use accent for tier color)
  },
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GrayColor = keyof typeof colors.gray;
export type StrengthLevel = keyof typeof colors.strength;
