import React from 'react';
import { View, ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import clsx from 'clsx';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../theme/spacing';

export interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export function Card({
  style,
  className,
  ...props
}: CardProps & { className?: string }) {
  const { colors } = useThemeColors();
  return (
    <View
      className={clsx('border', className)}
      style={[
        shadows.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: borderRadius.card,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardHeader({
  style,
  className,
  ...props
}: ViewProps & { className?: string }) {
  const { colors } = useThemeColors();
  return (
    <View
      className={clsx('border-b', className)}
      style={[
        { borderColor: colors.border, padding: spacing.base },
        style,
      ]}
      {...props}
    />
  );
}

export function CardContent({
  style,
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={className}
      style={[{ padding: spacing.base }, style]}
      {...props}
    />
  );
}

export default Card;
