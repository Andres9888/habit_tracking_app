/**
 * Color System - Barrel Export
 *
 * Central export point for all color tokens in the design system.
 *
 * ## Architecture
 *
 * The color system is organized into layers:
 *
 * 1. **Core Palette** (`core.ts`): All raw color values and scales
 *    - Primary green scale (100-700)
 *    - Gray scale (50-900) — warm stone neutrals
 *    - Strength levels (habit progress colors)
 *    - Semantic colors (error, success, warning, info)
 *    - Streak colors (burnished gold)
 *    - Premium tier colors
 *
 * 2. **Semantic Tokens** (`semantic.ts`): Contextual aliases
 *    - Warm palette (background, cardBg, foreground, border, neutral)
 *    - Role-based naming for clearer intent
 *
 * 3. **Dark/Light Modes** (`../darkColors.ts`): Theme-aware colors
 *    - `darkColors`: Optimized for low-light viewing
 *    - `lightColors`: Warm stone aesthetic
 *    - Consumed via `useThemeColors()` hook in `ThemeContext.tsx`
 *
 * 4. **Milestone Colors** (`../milestone-colors.ts`): Achievement badges
 *    - Amber, violet, yellow, stone for streak milestones
 *
 * ## Usage Patterns
 *
 * ### Static Colors (Don't Change with Theme)
 *
 * Use when you need a specific color regardless of dark/light mode:
 *
 * ```tsx
 * import { colors } from '@/theme/colors';
 *
 * // Always forest green, regardless of theme
 * <Button color={colors.primary[600]} />
 *
 * // Always warm stone background
 * <View style={{ backgroundColor: colors.light.background }} />
 * ```
 *
 * ### Theme-Aware Colors (Adapt to Dark/Light Mode)
 *
 * Use when colors should change based on user's theme preference:
 *
 * ```tsx
 * import { useThemeColors } from '@/theme/ThemeContext';
 *
 * function MyComponent() {
 *   const { colors } = useThemeColors();
 *
 *   // Auto-switches between light/dark
 *   return (
 *     <View style={{
 *       backgroundColor: colors.background,
 *       borderColor: colors.border
 *     }}>
 *       <Text style={{ color: colors.text.primary }}>
 *         This text adapts to theme
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * ## Color Naming Convention
 *
 * We use a consistent naming system across the palette:
 *
 * - **Scale Numbers** (50-900): Lighter to darker in light mode
 *   - Gray: 50 = lightest (#FAF8F5), 900 = darkest (#1A1816)
 *   - Primary: 100 = lightest (#D1FAE5), 700 = darkest (#047857)
 *
 * - **Semantic Names**: Role-based tokens
 *   - `background`: App canvas
 *   - `surface`: Elevated elements
 *   - `card`: Card containers
 *   - `border`: Dividers and separators
 *   - `text.primary`: Highest emphasis text
 *   - `text.secondary`: Medium emphasis
 *   - `text.tertiary`: Low emphasis
 *
 * - **State Suffixes**:
 *   - `Light`: Tinted backgrounds (e.g., `errorLight`, `warningLight`)
 *   - No suffix: Default/primary usage
 *
 * ## WCAG Contrast Compliance
 *
 * All text colors meet WCAG 2.1 Level AA standards:
 *
 * ### Text Contrast Minimums
 * - Normal text (≤17pt): **4.5:1** contrast ratio
 * - Large text (≥22pt): **3:1** contrast ratio
 * - UI components: **3:1** contrast ratio
 *
 * ### Verified Ratios (Light Mode)
 * - ✅ `gray.700` (#3D3833) on white: **10.8:1** — headings
 * - ✅ `gray.800` (#2D2A26) on `background` (#F5F1ED): **~9:1** — primary text
 * - ✅ `gray.500` (#6B6560) on `background`: **5.1:1** — secondary text
 * - ✅ `primary.700` (#047857) on white: **Sufficient** for text
 * - ✅ `error` (#B53030) on `background`: **5.45:1**
 * - ✅ `success` (#15793C) on `background`: **4.88:1**
 * - ✅ `warning` (#9A5504) on `background`: **5.08:1**
 *
 * ### Contrast Warnings
 * - ⚠️ `warning.500` (#F59E0B) on white: **2.3:1** — Use `warning.700` for text
 * - ⚠️ `primary.500` (#10B981) on white: **2.9:1** — Use `primary.700` for text
 * - ⚠️ Disabled elements (`gray.300`) are WCAG-exempt per 1.4.3
 *
 * ## Color Token Review (Dead Code Check)
 *
 * This export structure has been reviewed for unused tokens:
 *
 * - ✅ All core palette colors are actively used in components
 * - ✅ Strength colors map to habit progress levels (starting → automatic)
 * - ✅ Streak colors used in StreakIndicator component
 * - ✅ Premium colors used for subscription tier badges
 * - ✅ Milestone colors used for achievement badges
 * - ✅ Dark mode colors fully implemented in ThemeContext
 * - ✅ Warm palette provides convenient semantic aliases
 *
 * No dead/unused tokens detected as of 2026-02-14.
 */

export { colors } from './core';
export type {
  ColorPalette,
  GrayColor,
  PrimaryColor,
  StrengthLevel,
} from './core';

export { warmPalette } from './semantic';
export type { WarmPaletteKey } from './semantic';

export { milestoneColors } from '../milestone-colors';
export type { MilestoneColorKey } from '../milestone-colors';

export { overlays } from './overlays';
export type { OverlayKey } from './overlays';

export { withAlpha } from './alpha';
