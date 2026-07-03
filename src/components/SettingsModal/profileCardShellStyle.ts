import type { SemanticColors } from '../../theme/darkColors';
import { getRaisedSurface } from './raisedSurface';

export function getProfileCardShellStyle(
  themeColors: SemanticColors,
  isDark = false
) {
  // Soft hairline + gentle lift — matches the Settings Final section cards.
  return {
    backgroundColor: getRaisedSurface(isDark),
    borderColor: isDark ? themeColors.border : 'rgba(45,42,38,0.07)',
    borderWidth: 1,
    shadowColor: '#2D2A26',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: isDark ? 0.18 : 0.05,
    shadowRadius: 9,
    elevation: 2,
  };
}
