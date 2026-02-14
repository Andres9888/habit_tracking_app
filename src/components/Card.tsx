import React from 'react';
import { View, ViewProps } from 'react-native';
import clsx from 'clsx';

export type CardProps = ViewProps;

export function Card({
  style,
  className,
  ...props
}: CardProps & { className?: string }) {
  return (
    <View
      className={clsx(
        'rounded-xl border border-stone-200 bg-white shadow-sm',
        className
      )}
      style={style}
      {...props}
    />
  );
}

export function CardHeader({
  style,
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={clsx('border-b border-stone-200 p-4', className)}
      style={style}
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
