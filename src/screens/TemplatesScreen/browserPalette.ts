/**
 * browserPalette — warm cream palette for the Habit Browser (Templates
 * library) screen, imported from the "Habit Browser Final" Claude Design.
 *
 * Screen-scoped by design: these constants are applied directly on the
 * browse-path components instead of the global light/dark theme, so the
 * browser keeps its editorial cream look in either app theme. The rest of
 * the app continues to use `useThemeColors()` untouched.
 */

export const browserPalette = {
  // Surfaces
  background: '#EFEBE2', // Screen background
  card: '#FAF7F0', // Habit card surface
  border: '#DDD6C6', // Card / control hairline
  detailsFill: '#FFFFFF', // "Details" pill fill on the warm card
  startSmallBg: '#EDE9DF', // Recessed "START SMALL" box
  metaPillBg: '#EDE9DF', // Footer duration · frequency pill
  closeBg: '#E5E0D4', // Circular header close button
  iconTile: '#F8E9CE', // Section-header emoji tile

  // Text
  textPrimary: '#22201B',
  textSecondary: '#545046',
  textTertiary: '#8C877B',
  textInverse: '#FAF7F0', // On the dark ink chip / green add button

  // Chips
  chipIdle: '#F5F1E8',
  chipActive: '#22201B', // Selected "ink pill"

  // Add / added toggle
  addBg: '#2FA36F', // Idle green "+"
  addedBg: '#DDF2E4', // Added light-green pill
  addedFg: '#157A4E', // Added check + text
} as const;
