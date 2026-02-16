/**
 * Milestone & Achievement Badge Colors
 *
 * Used primarily by `StreakIndicator` component for achievement milestones.
 * These colors celebrate user progress with warm metallics and stone tones.
 *
 * ## Design System Context
 *
 * These colors are extracted from `StreakIndicator.constants.ts` to centralize
 * all color definitions in the theme system. This ensures:
 * - Single source of truth for milestone colors
 * - Easier theme-wide adjustments
 * - Type safety across components
 * - WCAG compliance documentation
 *
 * ## Color Roles
 *
 * - **Amber/Gold**: Achieved milestones, current streak badges
 * - **Violet**: Special achievements (e.g., perfect weeks)
 * - **Yellow**: Alternative milestone tier
 * - **Stone**: Unachieved/locked milestones, neutral labels
 *
 * ## Usage
 *
 * @example
 * ```tsx
 * import { milestoneColors } from '@/theme/colors';
 *
 * // Achieved milestone badge
 * <View style={{
 *   backgroundColor: milestoneColors.amberLight,
 *   borderColor: milestoneColors.amberBorder
 * }}>
 *   <Text style={{ color: milestoneColors.amberText }}>
 *     7 Day Streak!
 *   </Text>
 * </View>
 *
 * // Locked/unachieved milestone
 * <View style={{
 *   backgroundColor: milestoneColors.stone100,
 *   borderColor: milestoneColors.stone
 * }}>
 *   <Text style={{ color: milestoneColors.stone600 }}>
 *     Locked
 *   </Text>
 * </View>
 * ```
 *
 * ## WCAG Contrast
 *
 * All text/background combinations meet WCAG AA standards:
 * - `amberText` on `amberLight`: ✅ Sufficient contrast
 * - `stone600` on `stone100`: ✅ 4.5:1+ for normal text
 * - `stone900` on white backgrounds: ✅ High contrast
 */

export const milestoneColors = {
  // ─────────────────────────────────────────────────────────────
  // Amber/Gold (Primary Milestone Color)
  // ─────────────────────────────────────────────────────────────

  /** Primary amber accent — #F59E0B */
  amber: '#F59E0B',

  /** Dark amber for best streak text — #92400e (WCAG AA compliant) */
  amber800: '#92400e',

  /** Amber border for badges — #FCD34D (light gold) */
  amberBorder: '#FCD34D',

  /** Darker amber for high-contrast needs — #78350F */
  amberDark: '#78350F',

  /** Light amber tint for badge backgrounds — #FEF9C3 */
  amberLight: '#FEF9C3',

  /** Amber text on light backgrounds — #A16207 (WCAG AA) */
  amberText: '#A16207',

  // ─────────────────────────────────────────────────────────────
  // Stone (Neutral/Locked States)
  // ─────────────────────────────────────────────────────────────

  /** Medium stone for borders/icons — #A8A29E */
  stone: '#A8A29E',

  /** Light stone for unachieved badge backgrounds — #f5f5f4 */
  stone100: '#f5f5f4',

  /** Medium stone for streak labels — #57534e */
  stone600: '#57534e',

  /** Dark stone for streak numbers — #1c1917 */
  stone900: '#1c1917',

  // ─────────────────────────────────────────────────────────────
  // Accent Colors (Special Achievements)
  // ─────────────────────────────────────────────────────────────

  /** Violet for special achievements — #8B5CF6 */
  violet: '#8B5CF6',

  /** Yellow for alternative milestone tier — #EAB308 */
  yellow: '#EAB308',
} as const;

export type MilestoneColorKey = keyof typeof milestoneColors;
