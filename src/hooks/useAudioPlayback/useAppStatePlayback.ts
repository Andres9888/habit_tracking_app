/**
 * useAppStatePlayback - App state monitoring for audio playback
 *
 * Monitors app state changes to detect and handle audio interruptions.
 */

import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { PlaybackState, InterruptionReason } from './types';

export interface UseAppStatePlaybackOptions {
  onInterruptionEnded?: () => void;
}

export interface UseAppStatePlaybackDeps {
  currentState: PlaybackState;
  previousAppStateRef: React.MutableRefObject<AppStateStatus>;
  handleInterruption: (reason: InterruptionReason) => void;
}

/**
 * Hook for monitoring app state and handling interruptions
 *
 * Detects when app goes to background/foreground and triggers appropriate
 * interruption handling for audio playback.
 */
export function useAppStatePlayback(
  deps: UseAppStatePlaybackDeps,
  options: UseAppStatePlaybackOptions
): void {
  const { currentState, previousAppStateRef, handleInterruption } = deps;
  const { onInterruptionEnded } = options;

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = previousAppStateRef.current;

      // App went to background while playing - potential interruption
      if (
        previousState === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive') &&
        currentState === 'playing'
      ) {
        // On iOS, 'inactive' often means phone call or other interruption
        const reason: InterruptionReason =
          nextAppState === 'inactive' ? 'phone-call' : 'other-app';
        handleInterruption(reason);
      }

      // App came back to foreground after being interrupted
      if (
        (previousState === 'background' || previousState === 'inactive') &&
        nextAppState === 'active' &&
        currentState === 'interrupted'
      ) {
        // Notify that interruption has ended - user can now resume
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
  }, [
    currentState,
    handleInterruption,
    onInterruptionEnded,
    previousAppStateRef,
  ]);
}
