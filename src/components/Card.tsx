import React from "react";
import { View, ViewProps } from "react-native";
import clsx from "clsx";

export interface CardProps extends ViewProps {
  style?: any;
}

export function Card({ style, className, ...props }: CardProps & { className?: string }) {
  return (
    <View
      className={clsx(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      style={style}
      {...props}
    />
  );
}

export function CardHeader({ style, className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={clsx(
        "p-4 border-b border-slate-200",
        className
      )}
      style={style}
      {...props}
    />
  );
}

export function CardContent({ style, className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={clsx(
        "p-4",
        className
      )}
      style={style}
      {...props}
    />
  );
}

export default Card;
