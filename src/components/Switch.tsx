import React from "react";
import { Pressable, View, ViewStyle, Animated } from "react-native";
import { clsx } from "clsx";

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
  sm: { track: "h-5 w-8", thumb: "h-4 w-4" },
  md: { track: "h-6 w-10", thumb: "h-5 w-5" },
  lg: { track: "h-7 w-12", thumb: "h-6 w-6" },
};

export const Switch = React.forwardRef<View, SwitchProps>(
  function Switch(
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
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        accessibilityLabel={accessibilityLabel}
        className="self-start"
        style={style}
      >
        <View
          className={clsx(
            "rounded-full border border-slate-200 justify-center shadow-sm transition-colors",
            sizeClasses[size].track,
            checked ? "bg-slate-900 border-slate-900" : "bg-slate-100",
            disabled && "opacity-50"
          )}
        >
          <View
            className={clsx(
              "rounded-full bg-white shadow-sm transition-transform",
              sizeClasses[size].thumb,
              checked ? (
                size === "sm" ? "translate-x-3" :
                size === "md" ? "translate-x-4" :
                "translate-x-5"
              ) : "translate-x-0.5"
            )}
          />
        </View>
      </Pressable>
    );
  }
);

export default Switch;
