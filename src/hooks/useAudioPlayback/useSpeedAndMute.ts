/**
 * useSpeedAndMute - Speed and mute controls for audio playback
 *
 * Provides playback speed adjustment and mute toggle functionality.
 */

import { useCallback } from 'react';
import { Audio } from 'expo-av';
import type { PlaybackSpeed, PlaybackStatus } from './types';

export interface UseSpeedAndMuteOptions {
  onError?: (error: Error) => void;
}

export interface UseSpeedAndMuteDeps {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  isMuted: boolean;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
}

export interface UseSpeedAndMuteReturn {
  setSpeed: (speed: PlaybackSpeed) => Promise<void>;
  toggleMute: () => Promise<void>;
}

/**
 * Hook for speed and mute controls
 */
export function useSpeedAndMute(
  deps: UseSpeedAndMuteDeps,
  options: UseSpeedAndMuteOptions
): UseSpeedAndMuteReturn {
  const { soundRef, isMuted, setStatus } = deps;
  const { onError } = options;

  /**
   * Set playback speed
   */
  const setSpeed = useCallback(
    async (speed: PlaybackSpeed): Promise<void> => {
      if (!soundRef.current) return;

      try {
        await soundRef.current.setRateAsync(speed, true);
        setStatus((prev) => ({ ...prev, speed }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to set speed';
        setStatus((prev) => ({
          ...prev,
          errorMessage,
          state: 'error',
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [onError, soundRef, setStatus]
  );

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      const newMuted = !isMuted;
      await soundRef.current.setIsMutedAsync(newMuted);
      setStatus((prev) => ({ ...prev, isMuted: newMuted }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to toggle mute';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [isMuted, onError, soundRef, setStatus]);

  return { setSpeed, toggleMute };
}
