import { ForwardedRef, useCallback, useRef } from "react";

interface UseComponentLogicParams {
  forwardedRef: ForwardedRef<HTMLInputElement>;
}

export function useComponentLogic({ forwardedRef }: UseComponentLogicParams) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback((node: HTMLInputElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef && typeof forwardedRef === "object") {
      (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  }, [forwardedRef]);

  return {
    internalRef,
    setRefs,
  } as const;
}

export default useComponentLogic;
