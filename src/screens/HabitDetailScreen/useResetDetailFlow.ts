import { useEffect } from 'react';

/** Return to Detail when the modal closes or the habit changes. */
export function useResetDetailFlow(
  reset: () => void,
  visible: boolean,
  habitId?: string
) {
  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  useEffect(() => {
    reset();
  }, [habitId, reset]);
}
