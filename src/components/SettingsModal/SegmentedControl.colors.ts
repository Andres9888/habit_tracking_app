import { darkColors, lightColors } from '@/theme/darkColors';

/**
 * Shared overlay colors for inline segmented-control pickers
 * (SegmentedTextPicker, SortFamilyPicker, SoundPicker).
 *
 * The rgba values are intentional — they're alpha overlays that must
 * composite over varying theme surfaces, so they stay translucent rather
 * than resolving to a flat token. Centralized here so all three pickers
 * read from one source instead of duplicating (and drifting) the literals.
 *
 * `accent` is theme-aware (mirrors `useThemeColors().colors.primary[700]`):
 * #047857 in light, #A7F3D0 in dark.
 */
export function getSegmentedControlColors(isDark: boolean) {
  const palette = isDark ? darkColors : lightColors;
  return {
    /**
     * Selected icon/label tint — INK, not brand green. Green tint made a
     * selected segment look like one more green thing on a page already full
     * of green tiles and toggles; inverting text-primary against the canvas
     * makes "this one is chosen" unmistakable, and matches the Habit Browser's
     * `chipActive`. Inverting the pair keeps contrast correct in both themes.
     */
    accent: palette.text.inverse,
    /** Selected-option background — the ink chip. */
    selectedBg: palette.text.primary,
    /** Unselected container/pill background overlay */
    containerBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
  };
}
