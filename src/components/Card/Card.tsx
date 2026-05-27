import React from 'react';
import { View, ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import clsx from 'clsx';
import { useThemeColors } from '../../theme/ThemeContext';

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
      className={clsx('rounded-2xl border shadow-sm', className)}
      style={[
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
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
      className={clsx('border-b p-4', className)}
      style={[{ borderColor: colors.border }, style]}
      {...props}
    />
  );
}

export function CardContent({
  style,
  className,
  ...props
}: ViewProps & { className?: string }) {
  return <View className={clsx('p-4', className)} style={style} {...props} />;
}

export default Card;
