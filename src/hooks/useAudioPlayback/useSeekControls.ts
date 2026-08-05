/**
 * useSeekControls - Seek operations for audio playback
 *
 * Provides seeking functionality (progress, seconds, forward, backward).
 */

import { useCallback } from 'react';
import { Audio } from 'expo-av';
import type { PlaybackStatus } from './types';
import { DEFAULT_SEEK_STEP_SECONDS } from './constants';

export interface UseSeekControlsOptions {
  onError?: (error: Error) => void;
}

export interface UseSeekControlsDeps {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  durationSeconds: number;
  positionSeconds: number;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
}

export interface UseSeekControlsReturn {
  seekToProgress: (progress: number) => Promise<void>;
  seekToSeconds: (seconds: number) => Promise<void>;
  seekForward: (seconds?: number) => Promise<void>;
  seekBackward: (seconds?: number) => Promise<void>;
}

/**
 * Hook for seek controls
 */
export function useSeekControls(
  deps: UseSeekControlsDeps,
  options: UseSeekControlsOptions
): UseSeekControlsReturn {
  const { soundRef, durationSeconds, positionSeconds, setStatus } = deps;
  const { onError } = options;

  /**
   * Seek to a specific position (0-1 progress)
   */
  const seekToProgress = useCallback(
    async (progress: number): Promise<void> => {
      if (!soundRef.current || durationSeconds === 0) return;

      try {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        const positionMillis = clampedProgress * durationSeconds * 1000;

        setStatus((prev) => ({ ...prev, state: 'seeking' }));
        await soundRef.current.setPositionAsync(positionMillis);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to seek';
        setStatus((prev) => ({
          ...prev,
          errorMessage,
          state: 'error',
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [durationSeconds, onError, soundRef, setStatus]
  );

  /**
   * Seek to a specific position in seconds
   */
  const seekToSeconds = useCallback(
    async (seconds: number): Promise<void> => {
      if (!soundRef.current) return;

      try {
        const clampedSeconds = Math.min(durationSeconds, Math.max(0, seconds));
        const positionMillis = clampedSeconds * 1000;

        setStatus((prev) => ({ ...prev, state: 'seeking' }));
        await soundRef.current.setPositionAsync(positionMillis);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to seek';
        setStatus((prev) => ({
          ...prev,
          errorMessage,
          state: 'error',
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [durationSeconds, onError, soundRef, setStatus]
  );

  /**
   * Seek forward by a number of seconds
   */
  const seekForward = useCallback(
    async (seconds: number = DEFAULT_SEEK_STEP_SECONDS): Promise<void> => {
      const newPosition = Math.min(positionSeconds + seconds, durationSeconds);
      await seekToSeconds(newPosition);
    },
    [positionSeconds, durationSeconds, seekToSeconds]
  );

  /**
   * Seek backward by a number of seconds
   */
  const seekBackward = useCallback(
    async (seconds: number = DEFAULT_SEEK_STEP_SECONDS): Promise<void> => {
      const newPosition = Math.max(positionSeconds - seconds, 0);
      await seekToSeconds(newPosition);
    },
    [positionSeconds, seekToSeconds]
  );

  return {
    seekBackward,
    seekForward,
    seekToProgress,
    seekToSeconds,
  };
}
