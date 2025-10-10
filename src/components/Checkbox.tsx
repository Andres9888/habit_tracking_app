import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { clsx } from "clsx";

type CheckboxSize = "sm" | "md" | "lg";
type CheckboxVariant = "primary" | "success" | "neutral" | "danger";

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const sizeClasses = {
  sm: { box: "w-4 h-4", text: "text-[10px]" },
  md: { box: "w-5 h-5", text: "text-xs" },
  lg: { box: "w-6 h-6", text: "text-sm" },
};

const variantClasses = {
  primary: "bg-slate-900 border-slate-900",
  success: "bg-green-600 border-green-600",
  neutral: "bg-slate-700 border-slate-700",
  danger: "bg-red-600 border-red-600",
};

export const Checkbox = React.forwardRef<View, CheckboxProps>(
  function Checkbox(
    {
      checked = false,
      disabled = false,
      indeterminate = false,
      variant = "primary",
      size = "md",
      onPress,
      style,
      accessibilityLabel,
    },
    ref
  ) {
    const isIndeterminate = indeterminate && !checked;
    const isActive = checked || isIndeterminate;

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isActive, disabled }}
        accessibilityLabel={accessibilityLabel}
        className="self-start"
        style={style}
      >
        <View
          className={clsx(
            "rounded border border-slate-200 bg-white items-center justify-center shadow-sm",
            sizeClasses[size].box,
            isActive && variantClasses[variant],
            disabled && "opacity-50"
          )}
        >
          {isActive && (
            <Text
              className={clsx(
                "text-white font-bold",
                sizeClasses[size].text
              )}
            >
              {isIndeterminate ? '−' : '✓'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

export default Checkbox;
