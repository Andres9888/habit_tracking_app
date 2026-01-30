/**
 * useLoadAudio - Audio loading and unloading
 *
 * Handles loading audio from URI and cleanup.
 */

import { useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import type { PlaybackStatus } from './types';
import {
  STATUS_UPDATE_INTERVAL_MS,
  INITIAL_PLAYBACK_STATUS,
} from './constants';

export interface UseLoadAudioOptions {
  autoPlayOnLoad: boolean;
  onError?: (error: Error) => void;
}

export interface UseLoadAudioDeps {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  wasPlayingBeforeInterruptionRef: React.MutableRefObject<boolean>;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  configureAudioMode: () => Promise<void>;
  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void;
}

export interface UseLoadAudioReturn {
  loadAudio: (uri: string) => Promise<void>;
  unloadAudio: () => Promise<void>;
}

/**
 * Hook for loading and unloading audio
 */
export function useLoadAudio(
  deps: UseLoadAudioDeps,
  options: UseLoadAudioOptions
): UseLoadAudioReturn {
  const {
    soundRef,
    wasPlayingBeforeInterruptionRef,
    setStatus,
    configureAudioMode,
    onPlaybackStatusUpdate,
  } = deps;
  const { autoPlayOnLoad, onError } = options;

  /**
   * Load audio from URI
   */
  const loadAudio = useCallback(
    async (uri: string): Promise<void> => {
      try {
        // Unload any existing audio first
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        setStatus((prev) => ({
          ...prev,
          audioUri: uri,
          didJustFinish: false,
          durationSeconds: 0,
          errorMessage: null,
          positionSeconds: 0,
          progress: 0,
          state: 'loading',
        }));

        // Configure audio mode
        await configureAudioMode();

        // Create and load sound
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            progressUpdateIntervalMillis: STATUS_UPDATE_INTERVAL_MS,
            shouldPlay: autoPlayOnLoad,
          },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;

        setStatus((prev) => ({
          ...prev,
          state: autoPlayOnLoad ? 'playing' : 'ready',
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load audio';
        setStatus((prev) => ({
          ...prev,
          errorMessage,
          state: 'error',
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [
      configureAudioMode,
      autoPlayOnLoad,
      onPlaybackStatusUpdate,
      onError,
      soundRef,
      setStatus,
    ]
  );

  /**
   * Unload the current audio
   */
  const unloadAudio = useCallback(async (): Promise<void> => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // Ignore unload errors
      }
      soundRef.current = null;
    }

    wasPlayingBeforeInterruptionRef.current = false;
    setStatus(INITIAL_PLAYBACK_STATUS);
  }, [soundRef, wasPlayingBeforeInterruptionRef, setStatus]);

  return { loadAudio, unloadAudio };
}
