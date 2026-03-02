import baseTheme, { useAppTheme, fontFamilies } from '../../theme';
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
  const fallbackTheme = baseTheme.custom;
  const mergedTheme = {
    colors: {
      ...fallbackTheme.colors,
      ...theme?.custom?.colors,
    },
    componentSpacing: {
      ...fallbackTheme.componentSpacing,
      ...theme?.custom?.componentSpacing,
    },
    spacing: {
      ...fallbackTheme.spacing,
      ...theme?.custom?.spacing,
    },
  };

  const sizeConfigs: Record<ButtonSize, SizeConfig> = {
    large: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      height: 56,
      iconSize: 24,
      paddingHorizontal: mergedTheme.spacing.xl,
    },
    medium: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      height: mergedTheme.componentSpacing.button.height,
      iconSize: 20,
      paddingHorizontal: mergedTheme.spacing.lg,
    },
    small: {
      fontFamily: fontFamilies.primary.text,
      fontSize: 15,
      height: 44,
      iconSize: 16,
      paddingHorizontal: mergedTheme.spacing.base,
    },
  };

  const config = sizeConfigs[size] ?? sizeConfigs.medium;

  const getVariantStyles = (): VariantStyles => {
    const primary = mergedTheme.colors?.primary?.[500] ?? baseTheme.custom.colors.primary[500];
    const primaryText = mergedTheme.colors?.primary?.[700] ?? baseTheme.custom.colors.primary[700];
    const inverseText = mergedTheme.colors?.text?.inverse ?? baseTheme.custom.colors.text.inverse;
    const gray100 = mergedTheme.colors?.gray?.[100] ?? baseTheme.custom.colors.gray[100];
    const gray700 = mergedTheme.colors?.gray?.[700] ?? baseTheme.custom.colors.gray[700];

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
