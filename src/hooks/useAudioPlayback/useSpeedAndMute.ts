/**
 * useSpeedAndMute - Speed and mute controls for audio playback
 *
 * Provides playback speed adjustment and mute toggle functionality.
 */

import { useCallback } from 'react';
import type { AudioPlayer } from 'expo-audio';
import type { PlaybackSpeed, PlaybackStatus } from './types';

export interface UseSpeedAndMuteOptions {
  onError?: (error: Error) => void;
}

export interface UseSpeedAndMuteDeps {
  soundRef: React.MutableRefObject<AudioPlayer | null>;
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
        soundRef.current.setPlaybackRate(speed, 'high');
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
      soundRef.current.muted = newMuted;
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
