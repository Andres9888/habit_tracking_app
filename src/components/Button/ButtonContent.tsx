import React from 'react';
import { View, Text, ActivityIndicator, type TextStyle } from 'react-native';
import baseTheme, { useAppTheme } from '../../theme';
import { styles } from './styles';
import type { ButtonVariant, VariantStyles } from './types';
import { typography, fontWeights } from '@/theme/typography';

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
  const safeTheme = baseTheme?.custom ?? {};
  const mergedColors = {
    ...safeTheme?.colors,
    ...theme?.custom?.colors,
  };
  const mergedSpacing = {
    ...safeTheme?.spacing,
    ...theme?.custom?.spacing,
  };
  const mergedTypography = {
    ...safeTheme?.typography,
    ...theme?.custom?.typography,
  };
  const fallbackPrimary = mergedColors?.primary?.[500] ?? '#10B981';
  const fallbackInverseText = mergedColors?.text?.inverse ?? '#ffffff';
  const fallbackButtonTextStyle =
    (mergedTypography as { button?: TextStyle })?.button ??
    {
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.semibold,
      color: mergedColors?.text?.primary ?? '#2D2A26',
    };

  if (loading) {
    return (
      <ActivityIndicator
        color={
          variant === 'primary'
            ? mergedColors.text?.inverse ?? fallbackInverseText
            : mergedColors.primary?.[500] ?? fallbackPrimary
        }
        size='small'
      />
    );
  }

  if (variant === 'icon') {
    return icon || children;
  }

  return (
    <View style={styles.content}>
      {icon && iconPosition === 'left' ? <View style={{ marginRight: mergedSpacing.sm ?? 8 }}>{icon}</View> : null}

      {typeof children === 'string' ? (
        <Text
          maxFontSizeMultiplier={2}
            style={[
            fallbackButtonTextStyle,
            variantStyles.text,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}

      {icon && iconPosition === 'right' ? <View style={{ marginLeft: mergedSpacing.sm ?? 8 }}>{icon}</View> : null}
    </View>
  );
}
