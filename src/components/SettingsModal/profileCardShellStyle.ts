import { shadows } from '../../theme/spacing';
import type { lightColors } from '../../theme/darkColors';

type ThemePalette = typeof lightColors;

export function getProfileCardShellStyle(
  highContrastMode: boolean,
  themeColors: ThemePalette
) {
  return {
    backgroundColor: themeColors.card,
    borderColor: highContrastMode ? themeColors.border : undefined,
    borderWidth: highContrastMode ? 1 : 0,
    ...(highContrastMode
      ? { elevation: 0, shadowColor: 'transparent' }
      : shadows.card),
  };
}
