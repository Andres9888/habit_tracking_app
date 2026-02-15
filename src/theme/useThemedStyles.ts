/**
 * useThemedStyles — convenience hook for StyleSheet factories.
 *
 * Usage:
 *   // In styles file:
 *   export const createStyles = (colors: SemanticColors) => StyleSheet.create({ ... });
 *
 *   // In component:
 *   const styles = useThemedStyles(createStyles);
 */

import { useMemo } from 'react';
import type { SemanticColors } from './darkColors';
import { useThemeColors } from './ThemeContext';

type StyleFactory<T> = (colors: SemanticColors) => T;

export function useThemedStyles<T>(factory: StyleFactory<T>): T {
  const { colors } = useThemeColors();
  return useMemo(() => factory(colors), [factory, colors]);
}
