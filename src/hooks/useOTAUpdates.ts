/**
 * OTA Update Hook
 *
 * Checks for expo-updates on app foreground.
 * - Shows a non-intrusive banner when an update is available
 * - Auto-applies critical updates on next cold start
 * - Never interrupts user mid-action
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';

export type OTAStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'error';

const CHECK_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between checks

export function useOTAUpdates() {
  const [status, setStatus] = useState<OTAStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const lastCheckRef = useRef<number>(0);

  const checkForUpdate = useCallback(async () => {
    // Skip in dev or if checked recently
    if (__DEV__) return;
    if (Date.now() - lastCheckRef.current < CHECK_COOLDOWN_MS) return;

    try {
      setStatus('checking');
      lastCheckRef.current = Date.now();

      const result = await Updates.checkForUpdateAsync();

      if (result.isAvailable) {
        setStatus('downloading');
        await Updates.fetchUpdateAsync();
        setStatus('ready');
      } else {
        setStatus('idle');
      }
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Update check failed'
      );
      setStatus('error');
      // Reset to idle after a bit so banner doesn't persist on error
      setTimeout(() => setStatus('idle'), 5000);
    }
  }, []);

  const restart = useCallback(async () => {
    if (!__DEV__) {
      await Updates.reloadAsync();
    }
  }, []);

  // Check on app foreground
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkForUpdate();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);

    // Also check on mount (cold start)
    checkForUpdate();

    return () => subscription.remove();
  }, [checkForUpdate]);

  return { error, restart, status };
}
