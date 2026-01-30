/**
 * useInfoModal Hook
 *
 * Manages state for the info modal in HabitStrengthHistory.
 */

import { useCallback, useState } from 'react';

export function useInfoModal() {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return { hide, show, visible };
}

export default useInfoModal;
