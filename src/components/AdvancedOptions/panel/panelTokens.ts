/**
 * Tokens for the "More to customize" panel (direction 2a).
 *
 * Light values are verbatim from SPEC_more-to-customize-2a.md §3 — this is the
 * one file in the panel allowed to carry raw hex. Dark maps onto the theme's
 * semantic surfaces and keeps each row hue's ink at a lighter tint.
 */
import { withAlpha } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

export type PanelHueKey = 'reminder' | 'why' | 'streak' | 'curve' | 'growth';

export interface PanelHue {
  /** 32×32 icon tile fill */
  tile: string;
  /** Icon + value-chip ink */
  ink: string;
  /** Border for an "unset" (outlined) value chip */
  unsetBorder?: string;
}

export interface PanelTokens {
  panelBg: string;
  panelBorder: string;
  chipRestBg: string;
  chipRestBorder: string;
  chipSelectedBg: string;
  chipSelectedBorder: string;
  chipSelectedInk: string;
  /** Ink for a suggested-but-unselected chip's value + label. */
  chipSuggestedInk: string;
  /** Caps disclosure/link ink ("SEE THE DIFFERENCE"). */
  linkInk: string;
  dot: string;
  chevron: string;
  textPrimary: string;
  textSecondary: string;
  labelCaps: string;
  hues: Record<PanelHueKey, PanelHue>;
}

const LIGHT_HUES: Record<PanelHueKey, PanelHue> = {
  curve: { ink: '#047857', tile: '#DCF1E7' },
  growth: { ink: '#6D3AC7', tile: '#EBE4F7' },
  reminder: { ink: '#047857', tile: '#DCF1E7' },
  streak: { ink: '#8B6208', tile: '#FBF0CC', unsetBorder: '#E9D89A' },
  why: { ink: '#B45309', tile: '#FBEBD9', unsetBorder: '#E8C9A6' },
};

const DARK_INK: Record<PanelHueKey, string> = {
  curve: '#34D399',
  growth: '#B794F4',
  reminder: '#34D399',
  streak: '#E8C88A',
  why: '#F5B26B',
};

function darkHues(): Record<PanelHueKey, PanelHue> {
  const keys = Object.keys(DARK_INK) as PanelHueKey[];
  return keys.reduce((acc, key) => {
    const ink = DARK_INK[key];
    acc[key] = { ink, tile: withAlpha(ink, 0.14), unsetBorder: withAlpha(ink, 0.4) };
    return acc;
  }, {} as Record<PanelHueKey, PanelHue>);
}

export function usePanelTokens(): PanelTokens {
  const { colors, isDark } = useThemeColors();

  if (isDark) {
    return {
      chevron: colors.text.tertiary,
      chipRestBg: colors.surface,
      chipRestBorder: colors.border,
      chipSelectedBg: colors.primary[100],
      chipSelectedBorder: colors.primary[500],
      chipSelectedInk: colors.primary[700],
      chipSuggestedInk: colors.primary[700],
      dot: colors.primary[500],
      linkInk: colors.primary[700],
      hues: darkHues(),
      labelCaps: colors.text.secondary,
      panelBg: colors.card,
      panelBorder: colors.border,
      textPrimary: colors.text.primary,
      textSecondary: colors.text.secondary,
    };
  }

  return {
    chevron: '#A39D95',
    chipRestBg: '#F8F5F1',
    chipRestBorder: '#DDD8D2',
    chipSelectedBg: colors.primary[100],
    chipSelectedBorder: colors.primary[500],
    chipSelectedInk: colors.primary[700],
    chipSuggestedInk: colors.primary[700],
    dot: '#059669',
    linkInk: colors.primary[700],
    hues: LIGHT_HUES,
    labelCaps: '#6B6560',
    panelBg: '#F0EDE8',
    panelBorder: '#DDD8D2',
    textPrimary: '#2D2A26',
    textSecondary: '#6E6660',
  };
}
