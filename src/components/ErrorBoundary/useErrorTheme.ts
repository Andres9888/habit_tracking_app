/**
 * useErrorTheme — lightweight theme hook for error boundary components.
 *
 * Error boundaries may render **outside** ThemeColorProvider (e.g. the root
 * boundary wraps the entire app), so we cannot rely on useThemeColors().
 * Instead we read the system color scheme directly and return a small
 * semantic palette that mirrors SemanticColors structure.
 */

import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../../theme/darkColors';
import type { SemanticColors } from '../../theme/darkColors';

export function useErrorTheme(): { colors: SemanticColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
