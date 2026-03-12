import type { SizeConfig, ButtonVariant, VariantStyles } from './types';

interface ButtonVariantColors {
  gray100: string;
  gray700: string;
  inverseText: string;
  primary: string;
  primaryText: string;
}

export function getButtonVariantStyles(
  variant: ButtonVariant,
  config: SizeConfig,
  colors: ButtonVariantColors
): VariantStyles {
  switch (variant) {
    case 'primary': {
      return { container: { backgroundColor: colors.primary, borderWidth: 0 }, text: { color: colors.inverseText } };
    }
    case 'secondary': {
      return { container: { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1.5 }, text: { color: colors.primaryText } };
    }
    case 'ghost': {
      return { container: { backgroundColor: 'transparent', borderWidth: 0 }, text: { color: colors.primaryText } };
    }
    case 'icon': {
      return {
        container: { backgroundColor: colors.gray100, borderRadius: config.height / 2, borderWidth: 0, height: config.height, paddingHorizontal: 0, width: config.height },
        text: { color: colors.gray700 },
      };
    }
    default: {
      return { container: {}, text: {} };
    }
  }
}
