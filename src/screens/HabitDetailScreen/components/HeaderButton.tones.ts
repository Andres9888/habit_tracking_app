/** Tint sets for HeaderButton, split out to keep the component under 100 lines. */
import { withAlpha } from '@/theme';
import { mixHex } from '@/theme/colors';
import type { useThemeColors } from '../../../theme/ThemeContext';
import { buildInsightPalette } from '../insightPalette';

export type HeaderButtonTone = 'subtle' | 'accent' | 'onBand' | 'onBandCircle';

export interface HeaderButtonTint {
  bg: string;
  border: string;
  fg: string;
}

export function toneColors(
  tone: HeaderButtonTone,
  isDark: boolean,
  colors: ReturnType<typeof useThemeColors>['colors']
): HeaderButtonTint {
  const band = buildInsightPalette(colors, isDark);

  if (tone === 'onBandCircle') {
    return {
      bg: mixHex(colors.card, band.bandGradient[0], isDark ? 0.86 : 0.96),
      border: band.bandHairline,
      fg: band.bandFg,
    };
  }
  if (tone === 'onBand') {
    return { bg: 'transparent', border: 'transparent', fg: band.ctaGreen };
  }
  if (tone === 'accent') {
    return {
      bg: withAlpha(colors.primary[600], isDark ? 0.14 : 0.1),
      border: withAlpha(colors.primary[600], isDark ? 0.22 : 0.2),
      fg: colors.primary[700],
    };
  }
  const neutral = colors.gray[900];
  return {
    bg: withAlpha(neutral, isDark ? 0.08 : 0.04),
    border: withAlpha(neutral, isDark ? 0.1 : 0.08),
    fg: colors.text.secondary,
  };
}
