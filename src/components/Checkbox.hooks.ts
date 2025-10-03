import { ForwardedRef, useCallback, useEffect, useRef } from "react";

interface UseComponentLogicParams {
  forwardedRef: ForwardedRef<HTMLInputElement>;
  checked?: boolean;
  indeterminate?: boolean;
}

export function useComponentLogic({ forwardedRef, checked, indeterminate }: UseComponentLogicParams) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback((node: HTMLInputElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef && typeof forwardedRef === "object") {
      (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  }, [forwardedRef]);

  useEffect(() => {
    const input = internalRef.current;
    if (input) {
      input.indeterminate = Boolean(indeterminate) && !checked;
    }
  }, [checked, indeterminate]);

  return {
    internalRef,
    setRefs,
  } as const;
}

export default useComponentLogic;
