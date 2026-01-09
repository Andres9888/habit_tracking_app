/**
 * usePlaybackStatusHandler - Handles playback status updates
 *
 * Processes status updates from expo-av and detects audio interruptions.
 */

import { useCallback, useRef, useEffect } from 'react';
import type { AVPlaybackStatus } from 'expo-av';
import type {
  PlaybackState,
  PlaybackStatus,
  InterruptionReason,
} from './types';
import { isPlaybackStatusSuccess } from './statusUtils';

export interface UsePlaybackStatusHandlerOptions {
  onFinish?: () => void;
  onError?: (error: Error) => void;
  onInterrupted?: (reason: InterruptionReason) => void;
}

export interface UsePlaybackStatusHandlerReturn {
  onPlaybackStatusUpdate: (playbackStatus: AVPlaybackStatus) => void;
  handleInterruption: (reason: InterruptionReason) => void;
}

interface HandlerDeps {
  currentState: PlaybackState;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  wasPlayingBeforeInterruptionRef: React.MutableRefObject<boolean>;
}

/**
 * Hook for handling playback status updates from expo-av
 */
export function usePlaybackStatusHandler(
  deps: HandlerDeps,
  options: UsePlaybackStatusHandlerOptions
): UsePlaybackStatusHandlerReturn {
  const { currentState, setStatus, wasPlayingBeforeInterruptionRef } = deps;
  const { onFinish, onError, onInterrupted } = options;

  // Use ref to track current state to avoid stale closure in callbacks
  const currentStateRef = useRef<PlaybackState>(currentState);
  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  /**
   * Handle audio interruption (phone call, other app taking audio focus)
   */
  const handleInterruption = useCallback(
    (reason: InterruptionReason) => {
      // Only handle if we're currently playing (use ref for latest state)
      if (currentStateRef.current !== 'playing') return;

      // Mark that we were playing before interruption
      wasPlayingBeforeInterruptionRef.current = true;

      setStatus((prev) => ({
        ...prev,
        interruptionReason: reason,
        state: 'interrupted',
        wasInterrupted: true,
      }));

      onInterrupted?.(reason);
    },
    [onInterrupted, setStatus, wasPlayingBeforeInterruptionRef]
  );

  /**
   * Handle playback status updates from expo-av
   */
  const onPlaybackStatusUpdate = useCallback(
    (playbackStatus: AVPlaybackStatus) => {
      if (!isPlaybackStatusSuccess(playbackStatus)) {
        // Handle error or unloaded state
        if (!playbackStatus.isLoaded && playbackStatus.error) {
          setStatus((prev) => ({
            ...prev,
            errorMessage: playbackStatus.error || 'Playback error',
            state: 'error',
          }));
          onError?.(new Error(playbackStatus.error || 'Playback error'));
        }
        return;
      }

      const positionSeconds = Math.floor(
        (playbackStatus.positionMillis || 0) / 1000
      );
      const durationSeconds = Math.floor(
        (playbackStatus.durationMillis || 0) / 1000
      );
      const progress =
        durationSeconds > 0 ? positionSeconds / durationSeconds : 0;

      // Detect interruption: if we think we're playing but isPlaying is false
      // and we haven't finished and we're not paused by user
      // Use ref to get latest state value
      if (
        !playbackStatus.isPlaying &&
        !playbackStatus.didJustFinish &&
        currentStateRef.current === 'playing'
      ) {
        handleInterruption('system');
        return;
      }

      // Determine state based on playback status
      let newState: PlaybackState = 'ready';
      if (playbackStatus.isBuffering) {
        newState = 'loading';
      } else if (playbackStatus.didJustFinish) {
        newState = 'finished';
        onFinish?.();
      } else if (playbackStatus.isPlaying) {
        newState = 'playing';
      } else if (playbackStatus.positionMillis > 0) {
        newState = 'paused';
      }

      setStatus((prev) => ({
        ...prev,
        didJustFinish: playbackStatus.didJustFinish,
        durationSeconds,
        isMuted: playbackStatus.isMuted,
        positionSeconds,
        progress: Math.min(1, Math.max(0, progress)),
        state: newState,
      }));
    },
    [onFinish, onError, handleInterruption, setStatus]
  );

  return { handleInterruption, onPlaybackStatusUpdate };
}
