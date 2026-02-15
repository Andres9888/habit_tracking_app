
import React from "react";

import { cn } from "../lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeToClasses: Record<ButtonSize, string> = {
  lg: "px-5 py-3 text-base",
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

const variantToClasses: Record<ButtonVariant, string> = {
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700",
  primary: "bg-primary text-white hover:brightness-105 disabled:opacity-50",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:opacity-50",
  success: "bg-green-600 text-white hover:brightness-105 disabled:opacity-50",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        "focus:ring-ring focus:ring-offset-background",
        sizeToClasses[size],
        variantToClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export default Button;
