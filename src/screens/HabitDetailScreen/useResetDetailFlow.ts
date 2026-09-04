import { useEffect, useRef } from 'react';

/**
 * Return to Detail when the modal opens or the habit changes.
 *
 * On open, not on close: the screen stays on screen for the whole exit slide,
 * so a close-time reset swapped a pinned compact title back to the hero title
 * (and any nested route back to Detail) while the page was still moving. A
 * re-entry mid-exit also never hides, so only the open edge is reliable.
 */
export function useResetDetailFlow(
  reset: () => void,
  visible: boolean,
  habitId?: string
) {
  const wasVisible = useRef(visible);
  useEffect(() => {
    if (visible && !wasVisible.current) reset();
    wasVisible.current = visible;
  }, [visible, reset]);

  useEffect(() => {
    reset();
  }, [habitId, reset]);
}
