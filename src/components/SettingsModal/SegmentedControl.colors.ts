import { darkColors, lightColors } from '@/theme/darkColors';

/**
 * Shared overlay colors for inline segmented-control pickers
 * (DayShapePicker, CompletionIconPicker, SoundPicker).
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
    /** Selected icon/label tint */
    accent: palette.primary[700],
    /** Selected-option background overlay */
    selectedBg: isDark ? 'rgba(52,211,153,0.18)' : 'rgba(5,150,105,0.12)',
    /** Unselected container/pill background overlay */
    containerBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
  };
}
