import React, { ForwardedRef, InputHTMLAttributes, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

type CheckboxSize = "sm" | "md" | "lg";

type CheckboxVariant = "primary" | "success" | "neutral" | "danger";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  className?: string;
  indeterminate?: boolean;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
};

const sizeToDim: Record<CheckboxSize, string> = {
  lg: "h-6 w-6",
  md: "h-5 w-5",
  sm: "h-4 w-4",
};

export const Checkbox = React.forwardRef(function Checkbox(
  {
    checked,
    className,
    defaultChecked,
    disabled,
    id,
    indeterminate = false,
    name,
    onChange,
    variant = "primary",
    size = "md",
    ...rest
  }: CheckboxProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  const variantToCheckedClasses: Record<CheckboxVariant, string> = {
    primary: "peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]",
    success: "peer-checked:border-[var(--color-success)] peer-checked:bg-[var(--color-success)]",
    neutral: "peer-checked:border-[var(--color-text)] peer-checked:bg-[var(--color-text)]",
    danger: "peer-checked:border-red-600 peer-checked:bg-red-600",
  };

  const variantToFocusRing: Record<CheckboxVariant, string> = {
    primary: "peer-focus-visible:ring-[var(--color-primary)]",
    success: "peer-focus-visible:ring-[var(--color-success)]",
    neutral: "peer-focus-visible:ring-[var(--color-text)]",
    danger: "peer-focus-visible:ring-red-500",
  };

  useEffect(() => {
    const input = internalRef.current;
    if (input) {
      input.indeterminate = indeterminate && !checked;
    }
  }, [forwardedRef, indeterminate, checked]);

  return (
    <span className={cn("relative inline-flex", className)}>
      <input
        checked={checked}
        className={cn(
          "peer absolute inset-0 cursor-pointer opacity-0",
          sizeToDim[size]
        )}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        ref={(node) => {
          internalRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef && typeof forwardedRef === "object") {
            (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }
        }}
        type="checkbox"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-card)] text-white shadow-sm transition-colors motion-safe:transition-transform motion-safe:active:scale-95",
          "hover:border-[var(--color-border)]",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)]",
          variantToFocusRing[variant],
          variantToCheckedClasses[variant],
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          sizeToDim[size]
        )}
        data-indeterminate={indeterminate && !checked}
      >
        <svg
          aria-hidden="true"
          className={cn(
            "pointer-events-none h-3.5 w-3.5 text-white transition-opacity motion-safe:transition-transform",
            checked ? "opacity-100" : indeterminate ? "opacity-100" : "opacity-0",
            checked ? "scale-100" : "scale-90"
          )}
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {indeterminate && !checked ? (
            <path d="M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          ) : (
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          )}
        </svg>
      </span>
    </span>
  );
});

export default Checkbox;


