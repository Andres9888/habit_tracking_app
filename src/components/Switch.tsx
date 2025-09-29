import React, { ForwardedRef, InputHTMLAttributes, useRef } from "react";
import { cn } from "../lib/utils";

type SwitchSize = "sm" | "md" | "lg";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  className?: string;
  size?: SwitchSize;
};

const sizeToDims: Record<SwitchSize, { track: string; knob: string; translate: string }> = {
  sm: { track: "h-5 w-8", knob: "h-4 w-4", translate: "translate-x-3" },
  md: { track: "h-6 w-10", knob: "h-5 w-5", translate: "translate-x-4" },
  lg: { track: "h-7 w-12", knob: "h-6 w-6", translate: "translate-x-5" },
};

export const Switch = React.forwardRef(function Switch(
  { checked, className, defaultChecked, disabled, id, name, onChange, size = "md", ...rest }: SwitchProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <input
        checked={checked}
        className={cn("peer absolute inset-0 cursor-pointer opacity-0", sizeToDims[size].track)}
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
          "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)]",
          "peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          sizeToDims[size].track
        )}
      >
        <span
          className={cn(
            "ml-1 inline-block rounded-full bg-[var(--color-card)] shadow transition-transform",
            sizeToDims[size].knob,
            checked ? sizeToDims[size].translate : "translate-x-0"
          )}
        />
      </span>
    </span>
  );
});

export default Switch;


