import { useAppTheme } from '../../theme';
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

  const sizeConfigs: Record<ButtonSize, SizeConfig> = {
    large: {
      fontSize: 17,
      height: 56,
      iconSize: 24,
      paddingHorizontal: theme.custom.spacing.xl,
    },
    medium: {
      fontSize: 17,
      height: theme.custom.componentSpacing.button.height,
      iconSize: 20,
      paddingHorizontal: theme.custom.spacing.lg,
    },
    small: {
      fontSize: 13,
      height: 44,
      iconSize: 16,
      paddingHorizontal: theme.custom.spacing.base,
    },
  };

  const config = sizeConfigs[size];

  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'primary': {
        return {
          container: {
            backgroundColor: theme.custom.colors.primary[500],
            borderWidth: 0,
          },
          text: { color: theme.custom.colors.text.inverse },
        };
      }

      case 'secondary': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.custom.colors.primary[500],
            borderWidth: 1.5,
          },
          text: { color: theme.custom.colors.primary[700] },
        };
      }

      case 'ghost': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: theme.custom.colors.primary[700] },
        };
      }

      case 'icon': {
        return {
          container: {
            backgroundColor: theme.custom.colors.gray[100],
            borderRadius: config.height / 2,
            borderWidth: 0,
            height: config.height,
            paddingHorizontal: 0,
            width: config.height,
          },
          text: { color: theme.custom.colors.gray[700] },
        };
      }

      default: {
        return { container: {}, text: {} };
      }
    }
  };

  return { config, variantStyles: getVariantStyles() };
}
