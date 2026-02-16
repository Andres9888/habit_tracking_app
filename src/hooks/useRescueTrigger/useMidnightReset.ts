/**
 * Midnight reset effect for useRescueTrigger
 */

import { useEffect, type MutableRefObject } from 'react';
import { MIDNIGHT_CHECK_INTERVAL_MS } from './constants';

export function useMidnightReset(
  rescueShownRef: MutableRefObject<Set<string>>
) {
  useEffect(() => {
    let lastCheckedDate = new Date().getDate();

    const checkMidnight = () => {
      const now = new Date();
      const currentDate = now.getDate();
      // Reset when the calendar day changes, instead of checking for
      // exact 00:00 which can be missed by the 60s polling interval
      if (currentDate !== lastCheckedDate) {
        lastCheckedDate = currentDate;
        rescueShownRef.current.clear();
      }
    };

    const interval = setInterval(checkMidnight, MIDNIGHT_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [rescueShownRef]);
}
