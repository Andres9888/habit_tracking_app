import React from 'react';
import { cn } from '../lib/utils';

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

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      aria-label='View switch'
      className={cn('inline-flex rounded-lg bg-slate-100 p-1', className)}
      role='tablist'
    >
      {segments.map((segment) => {
        const active = segment.value === value;
        return (
          <button
            key={segment.value}
            aria-selected={active}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              active
                ? 'bg-card text-slate-900 shadow'
                : 'text-slate-600 hover:text-slate-800'
            )}
            role='tab'
            type='button'
            onClick={() => onChange(segment.value)}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
