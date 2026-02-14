/**
 * Dark-mode-aware icon background colors for settings rows.
 *
 * Light mode uses soft pastels; dark mode uses deeper, muted tones
 * that maintain the hue relationship without washing out on dark cards.
 */

/** Map of light-mode icon bg → dark-mode equivalent */
const DARK_ICON_BG: Record<string, string> = {
  '#bae6fd': '#0c4a6e', // sky — checkbox / reminder time
  '#d1fae5': '#064e3b', // emerald — gradient fill / share
  '#ddd6fe': '#4c1d95', // violet — circles
  '#e0e7ff': '#312e81', // indigo — account / support
  '#e7e5e4': '#292524', // stone — archived / legal
  '#fecaca': '#7f1d1d', // red — sign out
  '#fed7aa': '#7c2d12', // orange — bell notifications
  '#fef3c7': '#78350f', // amber — rate
  '#fef9c3': '#713f12', // yellow — crown premium
};

/**
 * Returns the appropriate icon background color for the current theme.
 */
export function iconBg(lightColor: string, isDark: boolean): string {
  if (!isDark) return lightColor;
  return DARK_ICON_BG[lightColor.toLowerCase()] ?? lightColor;
}
