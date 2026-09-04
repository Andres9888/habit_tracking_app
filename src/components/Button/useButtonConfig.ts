import baseTheme, { useAppTheme } from '../../theme';
import { airy } from '../../theme/airyScale';
import { typography, fontFamilies } from '../../theme/typography';
import type {
  ButtonSize,
  ButtonVariant,
  SizeConfig,
  VariantStyles,
} from './types';
import { getButtonVariantStyles } from './buttonVariantStyles';

/**
 * Custom hook for button size and variant configuration
 */
export function useButtonConfig(
  size: ButtonSize,
  variant: ButtonVariant
): {
  config: SizeConfig;
  variantStyles: VariantStyles;
} {
  const theme = useAppTheme();

  const fallbackTheme = baseTheme?.custom ?? {};
  const fallbackColors = fallbackTheme?.colors ?? {};
  const fallbackSpacing = fallbackTheme?.spacing ?? {};
  const fallbackComponentSpacing = fallbackTheme?.componentSpacing ?? {};
  const fallbackFontFamilyText = fontFamilies?.primary?.text ?? 'System';

  const mergedTheme = {
    colors: {
      ...fallbackColors,
      ...theme?.custom?.colors,
    },
    componentSpacing: {
      ...fallbackComponentSpacing,
      ...theme?.custom?.componentSpacing,
    },
    spacing: {
      ...fallbackSpacing,
      ...theme?.custom?.spacing,
    },
  };

  const sizeConfigs: Record<ButtonSize, SizeConfig> = {
    large: {
      fontFamily: fontFamilies?.primary?.text ?? fallbackFontFamilyText,
      fontSize: typography.body.fontSize,
      height: 56,
      iconSize: 24,
      paddingHorizontal: mergedTheme.spacing?.xl ?? 24,
    },
    medium: {
      fontFamily: fontFamilies?.primary?.text ?? fallbackFontFamilyText,
      fontSize: typography.body.fontSize,
      height: airy.controlHeight,
      iconSize: 20,
      paddingHorizontal: mergedTheme.spacing?.lg ?? 16,
    },
    small: {
      fontFamily: fontFamilies?.primary?.text ?? fallbackFontFamilyText,
      fontSize: typography.bodySmall.fontSize,
      height: 44,
      iconSize: 16,
      paddingHorizontal: mergedTheme.spacing?.base ?? 12,
    },
  };

  const config = sizeConfigs[size] ?? sizeConfigs.medium;
  const variantColors = {
    gray100:
      mergedTheme.colors?.gray?.[100] ??
      fallbackColors?.gray?.[100] ??
      '#FAF8F5',
    gray700:
      mergedTheme.colors?.gray?.[700] ??
      fallbackColors?.gray?.[700] ??
      '#3D3833',
    inverseText: mergedTheme.colors?.text?.inverse ?? '#ffffff',
    primary:
      mergedTheme.colors?.primary?.[700] ??
      fallbackColors?.primary?.[700] ??
      '#047857',
    primaryText:
      mergedTheme.colors?.primary?.[700] ??
      fallbackColors?.primary?.[700] ??
      '#047857',
  };

  return {
    config,
    variantStyles: getButtonVariantStyles(variant, config, variantColors),
  };
}
