import baseTheme, { useAppTheme } from '../../theme';
import { fontFamilies } from '../../theme/typography';
import type {
  ButtonSize,
  ButtonVariant,
  SizeConfig,
  VariantStyles,
} from './types';

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
      fontSize: 17,
      height: 56,
      iconSize: 24,
      paddingHorizontal: mergedTheme.spacing?.xl ?? 24,
    },
    medium: {
      fontFamily: fontFamilies?.primary?.text ?? fallbackFontFamilyText,
      fontSize: 17,
      height: mergedTheme.componentSpacing?.button?.height ?? 44,
      iconSize: 20,
      paddingHorizontal: mergedTheme.spacing?.lg ?? 16,
    },
    small: {
      fontFamily: fontFamilies?.primary?.text ?? fallbackFontFamilyText,
      fontSize: 15,
      height: 44,
      iconSize: 16,
      paddingHorizontal: mergedTheme.spacing?.base ?? 12,
    },
  };

  const config = sizeConfigs[size] ?? sizeConfigs.medium;

  const getVariantStyles = (): VariantStyles => {
    const primary =
      mergedTheme.colors?.primary?.[500] ??
      fallbackColors?.primary?.[500] ??
      '#10B981';
    const primaryText =
      mergedTheme.colors?.primary?.[700] ??
      fallbackColors?.primary?.[700] ??
      '#047857';
    const inverseText =
      mergedTheme.colors?.text?.inverse ??
      '#ffffff';
    const gray100 =
      mergedTheme.colors?.gray?.[100] ??
      fallbackColors?.gray?.[100] ??
      '#FAF8F5';
    const gray700 =
      mergedTheme.colors?.gray?.[700] ??
      fallbackColors?.gray?.[700] ??
      '#3D3833';

    switch (variant) {
      case 'primary': {
        return {
          container: {
            backgroundColor: primary,
            borderWidth: 0,
          },
          text: { color: inverseText },
        };
      }

      case 'secondary': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: primary,
            borderWidth: 1.5,
          },
          text: { color: primaryText },
        };
      }

      case 'ghost': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: primaryText },
        };
      }

      case 'icon': {
        return {
          container: {
            backgroundColor: gray100,
            borderRadius: config.height / 2,
            borderWidth: 0,
            height: config.height,
            paddingHorizontal: 0,
            width: config.height,
          },
          text: { color: gray700 },
        };
      }

      default: {
        return { container: {}, text: {} };
      }
    }
  };

  return { config, variantStyles: getVariantStyles() };
}
