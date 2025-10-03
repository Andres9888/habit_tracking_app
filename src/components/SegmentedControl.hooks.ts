import { useCallback, useMemo } from "react";

export interface Segment<T extends string> {
  value: T;
  label: string;
}

interface UseComponentLogicParams<T extends string> {
  segments: Array<Segment<T>>;
  value: T;
  onChange: (value: T) => void;
}

export function useComponentLogic<T extends string>({ segments, value, onChange }: UseComponentLogicParams<T>) {
  const activeIndex = useMemo(() => segments.findIndex((s) => s.value === value), [segments, value]);
  const isActive = useCallback((segmentValue: T) => segmentValue === value, [value]);
  const handleSelect = useCallback((segmentValue: T) => onChange(segmentValue), [onChange]);

  return {
    activeIndex,
    isActive,
    handleSelect,
  } as const;
}

export default useComponentLogic;
