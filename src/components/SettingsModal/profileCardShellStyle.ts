import type { SemanticColors } from '../../theme/darkColors';
import { getRaisedSurface, settingsCardShadow } from './raisedSurface';

export function getProfileCardShellStyle(
  themeColors: SemanticColors,
  isDark = false
) {
  return {
    backgroundColor: getRaisedSurface(isDark),
    borderColor: themeColors.border,
    borderWidth: 1,
    ...settingsCardShadow,
  };
}
