import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "../lib/utils";

export type ButtonVariant =
  | "danger"
  | "ghost"
  | "primary"
  | "secondary"
  | "success";

export type ButtonSize = "lg" | "md" | "sm";

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style"> {
  accessibilityLabel?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: unknown) => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeToContainerClasses: Record<ButtonSize, string> = {
  lg: "px-5 py-3",
  md: "px-4 py-2",
  sm: "px-3 py-1.5",
};

const sizeToTextClasses: Record<ButtonSize, string> = {
  lg: "text-base",
  md: "text-sm",
  sm: "text-sm",
};

const variantToContainerClasses: Record<ButtonVariant, string> = {
  danger: "bg-red-500",
  ghost: "bg-transparent",
  primary: "bg-primary",
  secondary: "bg-slate-100 dark:bg-slate-800",
  success: "bg-green-600",
};

const variantToTextClasses: Record<ButtonVariant, string> = {
  danger: "text-white",
  ghost: "text-slate-700 dark:text-slate-200",
  primary: "text-white",
  secondary: "text-slate-800 dark:text-slate-100",
  success: "text-white",
};

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(function Button(
  {
    accessibilityLabel,
    children,
    className,
    disabled = false,
    onClick,
    onPress,
    size = "md",
    variant = "primary",
    ...rest
  },
  ref
) {
  const containerClassName = cn(
    "items-center justify-center rounded-md shadow-sm",
    sizeToContainerClasses[size],
    variantToContainerClasses[variant],
    disabled && "opacity-50",
    className
  );

  const textClassName = cn(
    "font-medium",
    sizeToTextClasses[size],
    variantToTextClasses[variant]
  );

  const handlePress: PressableProps["onPress"] = (event) => {
    if (disabled) return;
    if (typeof onPress === "function") {
      onPress(event);
      return;
    }
    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  const isTextChild =
    typeof children === "string" || typeof children === "number";

  return (
    <Pressable
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={containerClassName}
      disabled={disabled}
      onPress={handlePress}
      {...rest}
    >
      {isTextChild ? (
        <Text className={textClassName}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
});

export { Button };
export default Button;
