import { shadows } from '../../theme/spacing';
import type { lightColors } from '../../theme/darkColors';

type ThemePalette = typeof lightColors;

export function getProfileCardShellStyle(themeColors: ThemePalette) {
  return {
    backgroundColor: themeColors.card,
    borderColor: themeColors.border,
    borderWidth: 1,
    ...shadows.floatingActionButton,
    shadowOpacity: 0.07,
  };
}
