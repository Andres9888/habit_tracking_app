import React from "react";
import { cn } from "../lib/utils";
import { useComponentLogic } from "./SegmentedControl.hooks";

export interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Array<Segment<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({ segments, value, onChange, className }: SegmentedControlProps<T>) {
  const { isActive, handleSelect } = useComponentLogic({ segments, value, onChange });
  return (
    <div role="tablist" aria-label="View switch" className={cn("inline-flex rounded-lg bg-slate-100 p-1", className)}>
      {segments.map((segment) => {
        const active = isActive(segment.value);
        return (
          <button
            key={segment.value}
            role="tab"
            aria-selected={active}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              active
                ? "bg-card shadow text-slate-900 dark:text-slate-100"
                : "text-slate-600 hover:text-slate-800",
            )}
            onClick={() => handleSelect(segment.value)}
            type="button"
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
