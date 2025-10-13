import React from "react";
import { Pressable, View, ViewStyle, Animated } from "react-native";
import clsx from "clsx";

type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const sizeClasses = {
  lg: { thumb: "h-6 w-6", track: "h-7 w-12" },
  md: { thumb: "h-5 w-5", track: "h-6 w-10" },
  sm: { thumb: "h-4 w-4", track: "h-5 w-8" },
};

export const Switch = React.forwardRef<View, SwitchProps>(function Switch(
  {
    checked = false,
    disabled = false,
    size = "md",
    onPress,
    style,
    accessibilityLabel,
  },
  ref
) {
  return (
    <Pressable
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      className="self-start"
      disabled={disabled}
      style={style}
      onPress={onPress}
    >
      <View
        className={clsx(
          "justify-center rounded-full border border-slate-200 shadow-sm transition-colors",
          sizeClasses[size].track,
          checked ? "border-slate-900 bg-slate-900" : "bg-slate-100",
          disabled && "opacity-50"
        )}
      >
        <View
          className={clsx(
            "rounded-full bg-white shadow-sm transition-transform",
            sizeClasses[size].thumb,
            checked
              ? size === "sm"
                ? "translate-x-3"
                : size === "md"
                  ? "translate-x-4"
                  : "translate-x-5"
              : "translate-x-0.5"
          )}
        />
      </View>
    </Pressable>
  );
});

export default Switch;
