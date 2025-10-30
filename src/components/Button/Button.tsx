/**
 * Button Component - React Native
 * Based on UX Specification Section 4.2
 *
 * Variants: Primary (filled), Secondary (outlined), Ghost (text only), Icon (circular)
 * States: Default, Pressed (scale 0.95), Disabled (50% opacity), Loading (spinner)
 * Sizes: Small (32pt), Medium (44pt), Large (56pt)
 */

import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button content (text or icon) */
  children: React.ReactNode;

  /** Button variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Loading state - shows spinner */
  loading?: boolean;

  /** Icon to display (for icon variant or alongside text) */
  icon?: React.ReactNode;

  /** Icon position (left or right of text) */
  iconPosition?: 'left' | 'right';

  /** Full width button */
  fullWidth?: boolean;

  /** Custom styles */
  style?: ViewStyle;

  /** Custom text styles */
  textStyle?: TextStyle;
}

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
  ...pressableProps
}: ButtonProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  // Animation: Scale down to 0.95 on press (UX spec Section 8.2)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  // Size configurations
  const sizeConfig = {
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
      // 44pt (Apple HIG)
      paddingHorizontal: theme.custom.spacing.lg,
    },
    small: {
      fontSize: 15,
      height: 32,
      iconSize: 16,
      paddingHorizontal: theme.custom.spacing.base,
    },
  };

  const config = sizeConfig[size];

  // Variant styles
  const getVariantStyles = (): {
    container: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case 'primary': {
        return {
          container: {
            backgroundColor: theme.custom.colors.primary[500],
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      }

      case 'secondary': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.custom.colors.primary[500],
            borderWidth: 1.5,
          },
          text: {
            color: theme.custom.colors.primary[500],
          },
        };
      }

      case 'ghost': {
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: theme.custom.colors.primary[500],
          },
        };
      }

      case 'icon': {
        return {
          container: {
            backgroundColor: theme.custom.colors.gray[100],
            borderRadius: config.height / 2,
            borderWidth: 0,
            height: config.height,
            // Circular
            paddingHorizontal: 0,
            width: config.height,
          },
          text: {
            color: theme.custom.colors.gray[700],
          },
        };
      }

      default: {
        return {
          container: {},
          text: {},
        };
      }
    }
  };

  const variantStyles = getVariantStyles();

  // Disabled styles (50% opacity as per UX spec)
  const disabledStyles: ViewStyle =
    disabled || loading
      ? {
          opacity: 0.5,
        }
      : {};

  // Render loading spinner or content
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={
            variant === 'primary' ? '#FFFFFF' : theme.custom.colors.primary[500]
          }
          size='small'
        />
      );
    }

    if (variant === 'icon') {
      return icon || children;
    }

    // Text button with optional icon
    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <View style={{ marginRight: theme.custom.spacing.sm }}>{icon}</View>
        )}

        {typeof children === 'string' ? (
          <Text
            style={[
              theme.custom.typography.button,
              variantStyles.text,
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}

        {icon && iconPosition === 'right' && (
          <View style={{ marginLeft: theme.custom.spacing.sm }}>{icon}</View>
        )}
      </View>
    );
  };

  return (
    <AnimatedPressable
      accessible
      accessibilityRole='button'
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        styles.base,
        {
          borderRadius:
            variant === 'icon'
              ? config.height / 2
              : theme.custom.borderRadius.small,
          height: config.height,
          paddingHorizontal: variant === 'icon' ? 0 : config.paddingHorizontal,
        },
        variantStyles.container,
        disabledStyles,
        fullWidth && styles.fullWidth,
        variant !== 'icon' && theme.custom.shadows.card,
        style,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...pressableProps}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
