/**
 * Button Component - React Native
 * Based on UX Specification Section 4.2
 *
 * Variants: Primary (filled), Secondary (outlined), Ghost (text only), Icon (circular)
 * States: Default, Pressed (scale 0.95), Disabled (50% opacity), Loading (spinner)
 * Sizes: Small (32pt), Medium (44pt), Large (56pt)
 */

import { Pressable, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import baseTheme, { useAppTheme } from '../../theme';
import { useFocusRing } from '../../utils/accessibility';
import { ButtonContent } from './ButtonContent';
import { styles } from './styles';
import type { ButtonProps } from './types';
import { useButtonAnimation } from './useButtonAnimation';
import { useButtonConfig } from './useButtonConfig';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  ...pressableProps
}: ButtonProps) {
  const theme = useAppTheme();
  const safeTheme = baseTheme?.custom ?? {};
  const mergedBorderRadius = {
    ...safeTheme.borderRadius,
    ...theme?.custom?.borderRadius,
  };
  const mergedShadows = {
    ...safeTheme.shadows,
    ...theme?.custom?.shadows,
  };
  const cardShadow = mergedShadows.card ?? {};
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();
  const { config, variantStyles } = useButtonConfig(size, variant);
  const { focusStyle, focusHandlers } = useFocusRing({
    compact: size === 'small' || variant === 'icon',
    disabled: disabled || loading,
  });

  const disabledStyles: ViewStyle = disabled || loading ? { opacity: 0.5 } : {};

  return (
    <AnimatedPressable
      accessible
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      {...focusHandlers}
      style={[
        animatedStyle,
        styles.base,
        {
          borderRadius:
            variant === 'icon'
              ? config.height / 2
              : mergedBorderRadius.small,
          height: config.height,
          paddingHorizontal: variant === 'icon' ? 0 : config.paddingHorizontal,
        },
        variantStyles.container,
        disabledStyles,
        fullWidth && styles.fullWidth,
        variant !== 'icon' && cardShadow,
        focusStyle,
        style,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...pressableProps}
    >
      <ButtonContent
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        textStyle={textStyle}
        variant={variant}
        variantStyles={variantStyles}
      >
        {children}
      </ButtonContent>
    </AnimatedPressable>
  );
}

export default Button;
