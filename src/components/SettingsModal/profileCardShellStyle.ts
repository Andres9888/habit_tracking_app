import { shadows } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';
import { getRaisedSurface } from './raisedSurface';

export function getProfileCardShellStyle(
  _themeColors: SemanticColors,
  isDark = false
) {
  // Calm: one soft shadow shared with section cards; borderless float.
  return {
    backgroundColor: getRaisedSurface(isDark),
    ...shadows.floatingActionButton,
    shadowOpacity: 0.06,
  };
}
