/**
 * Hook for handling app state changes and audio interruptions
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { RecordingState } from './types';

interface UseAppStateInterruptionOptions {
  currentState: RecordingState;
  handleInterruption: (reason: 'phone-call' | 'other-app' | 'system') => void;
  onInterruptionEnded?: () => void;
}

/**
 * Monitors app state to detect audio interruptions from phone calls or other apps
 */
export function useAppStateInterruption(
  options: UseAppStateInterruptionOptions
) {
  const { currentState, handleInterruption, onInterruptionEnded } = options;

  // Track the previous app state for interruption detection
  const previousAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = previousAppStateRef.current;

      // App went to background while recording - potential interruption
      if (
        previousState === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive') &&
        currentState === 'recording'
      ) {
        // On iOS, 'inactive' often means phone call or other interruption
        const reason: 'phone-call' | 'other-app' | 'system' =
          nextAppState === 'inactive' ? 'phone-call' : 'other-app';
        handleInterruption(reason);
      }

      // App came back to foreground after being interrupted
      if (
        (previousState === 'background' || previousState === 'inactive') &&
        nextAppState === 'active' &&
        currentState === 'interrupted'
      ) {
        onInterruptionEnded?.();
      }

      previousAppStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [currentState, handleInterruption, onInterruptionEnded]);
}
