/**
 * useModalCleanup Hook
 *
 * Prevents navigation state leaks by resetting child modal states
 * when a parent modal closes.
 *
 * Usage:
 * ```tsx
 * useModalCleanup(visible, () => {
 *   setChildModal1Open(false);
 *   setChildModal2Open(false);
 * });
 * ```
 */

import { useEffect, useRef } from 'react';

export function useModalCleanup(
  visible: boolean,
  cleanup: () => void
): void {
  const wasVisibleRef = useRef(visible);

  useEffect(() => {
    // When modal transitions from visible to hidden, run cleanup
    if (wasVisibleRef.current && !visible) {
      cleanup();
    }
    wasVisibleRef.current = visible;
  }, [visible, cleanup]);
}

export default useModalCleanup;
