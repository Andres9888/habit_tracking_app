import { shadows } from '../../theme/spacing';
import type { lightColors } from '../../theme/darkColors';

type ThemePalette = typeof lightColors;

export function getProfileCardShellStyle(
  highContrastMode: boolean,
  themeColors: ThemePalette
) {
  return {
    backgroundColor: themeColors.card,
    borderColor: highContrastMode ? themeColors.border : themeColors.border,
    borderWidth: 1,
    ...(highContrastMode
      ? { elevation: 0, shadowColor: 'transparent' }
      : {
          ...shadows.floatingActionButton,
          shadowOpacity: 0.07,
        }),
  };
}
