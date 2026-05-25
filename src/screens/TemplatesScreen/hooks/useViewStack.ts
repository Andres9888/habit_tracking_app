/**
 * Array-based navigation stack — push/pop/reset for TemplatesScreen views
 */

import { useState } from 'react';
import type { TemplateViewState } from './useViewNavigation';

export interface ViewStackResult {
  current: TemplateViewState;
  stack: TemplateViewState[];
  canGoBack: boolean;
  push: (view: TemplateViewState) => void;
  pop: () => void;
  reset: () => void;
}

const MAX_DEPTH = 10;

export function useViewStack(
  initialView?: TemplateViewState
): ViewStackResult {
  const initial: TemplateViewState = initialView ?? { type: 'main' };
  const [stack, setStack] = useState<TemplateViewState[]>([initial]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const push = (view: TemplateViewState) => {
    setStack((prev) => {
      if (prev.length >= MAX_DEPTH) return prev;
      return [...prev, view];
    });
  };

  const pop = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const reset = () => {
    setStack([initial]);
  };

  return { canGoBack, current, pop, push, reset, stack };
}
