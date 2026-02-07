import { startOfDay } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const CHECK_INTERVAL_MS = 60_000; // 1 minute

/**
 * Returns today's date (start of day) and automatically refreshes it when:
 * - The app returns to foreground after being backgrounded
 * - A periodic 1-minute check detects the day has changed
 *
 * This prevents stale date bugs when the app stays open past midnight.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const refreshIfNewDay = () => {
      const now = startOfDay(new Date());
      setToday((prev) => (prev.getTime() === now.getTime() ? prev : now));
    };

    const handleAppStateChange = (nextState: AppStateStatus) => {
      const wasBackground = appStateRef.current.match(/inactive|background/);
      if (wasBackground && nextState === 'active') {
        refreshIfNewDay();
      }
      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    const interval = setInterval(refreshIfNewDay, CHECK_INTERVAL_MS);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return today;
}
