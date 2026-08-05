/**
 * Resolves a template's accent colour into a theme-aware hex.
 *
 * Category wins when it maps to a token — that is what keeps sibling habits in
 * a shelf visually consistent. The raw `iconColor` hex is only a fallback, for
 * custom habits and any category not yet in `CATEGORY_ICON_TOKENS`.
 */

import { useMemo } from 'react';
import { useThemeColors } from '../ThemeContext';
import { CATEGORY_ICON_TOKENS } from './categoryTokens';
import { snapToIconToken } from './snap';
import { ICON_TOKENS } from './tokens';
import type { IconTokenKey } from './types';

export function resolveIconToken(
  fallbackHex: string,
  category?: string
): IconTokenKey {
  const fromCategory = category ? CATEGORY_ICON_TOKENS[category] : undefined;
  return fromCategory ?? snapToIconToken(fallbackHex);
}

/** Pure resolver, exported for unit tests. */
export function resolveIconAccent(
  fallbackHex: string,
  isDark: boolean,
  category?: string
): string {
  const token = ICON_TOKENS[resolveIconToken(fallbackHex, category)];
  return isDark ? token.dark : token.light;
}

export function useIconAccent(fallbackHex: string, category?: string): string {
  const { isDark } = useThemeColors();
  return useMemo(
    () => resolveIconAccent(fallbackHex, isDark, category),
    [fallbackHex, isDark, category]
  );
}
