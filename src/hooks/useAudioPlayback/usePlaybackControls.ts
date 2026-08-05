/**
 * usePlaybackControls - Play, pause, toggle, and replay controls
 *
 * Provides basic playback control functions.
 */

import { useCallback } from 'react';
import { Audio } from 'expo-av';
import type { PlaybackState, PlaybackStatus } from './types';

export interface UsePlaybackControlsOptions {
  onError?: (error: Error) => void;
}

export interface UsePlaybackControlsDeps {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  currentState: PlaybackState;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
}

export interface UsePlaybackControlsReturn {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  replay: () => Promise<void>;
}

/**
 * Hook for playback controls
 */
export function usePlaybackControls(
  deps: UsePlaybackControlsDeps,
  options: UsePlaybackControlsOptions
): UsePlaybackControlsReturn {
  const { soundRef, currentState, setStatus } = deps;
  const { onError } = options;

  /**
   * Start or resume playback
   */
  const play = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      // If finished, replay from beginning
      if (currentState === 'finished') {
        await soundRef.current.setPositionAsync(0);
      }
      await soundRef.current.playAsync();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to play';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [currentState, onError, soundRef, setStatus]);

  /**
   * Pause playback
   */
  const pause = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.pauseAsync();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to pause';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [onError, soundRef, setStatus]);

  /**
   * Toggle between play and pause
   */
  const togglePlayPause = useCallback(async (): Promise<void> => {
    await (currentState === 'playing' ? pause() : play());
  }, [currentState, play, pause]);

  /**
   * Replay from beginning
   */
  const replay = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to replay';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [onError, soundRef, setStatus]);

  return { pause, play, replay, togglePlayPause };
}
