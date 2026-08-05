/**
 * Midnight reset effect for useRescueTrigger
 */

import { useEffect, type MutableRefObject } from 'react';
import { MIDNIGHT_CHECK_INTERVAL_MS } from './constants';

export function useMidnightReset(
  rescueShownRef: MutableRefObject<Set<string>>
) {
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        rescueShownRef.current.clear();
      }
    };

    const interval = setInterval(checkMidnight, MIDNIGHT_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [rescueShownRef]);
}
