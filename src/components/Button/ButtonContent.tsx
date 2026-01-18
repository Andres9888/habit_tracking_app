import React from 'react';
import { View, Text, ActivityIndicator, type TextStyle } from 'react-native';
import { useAppTheme } from '../../theme';
import { styles } from './styles';
import type { ButtonVariant, VariantStyles } from './types';

interface ButtonContentProps {
  children: React.ReactNode;
  variant: ButtonVariant;
  loading: boolean;
  icon?: React.ReactNode;
  iconPosition: 'left' | 'right';
  variantStyles: VariantStyles;
  textStyle?: TextStyle;
}

/**
 * Button content renderer - handles loading, icon, and text states
 */
export function ButtonContent({
  children,
  variant,
  loading,
  icon,
  iconPosition,
  variantStyles,
  textStyle,
}: ButtonContentProps) {
  const theme = useAppTheme();

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
    return <>{icon || children}</>;
  }

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
}
