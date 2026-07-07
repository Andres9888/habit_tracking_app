import { shadows } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';
import { getRaisedSurface } from './raisedSurface';

export function getProfileCardShellStyle(
  themeColors: SemanticColors,
  isDark = false
) {
  return {
    backgroundColor: getRaisedSurface(isDark),
    borderColor: themeColors.border,
    borderWidth: 1,
    ...shadows.card,
  };
}
