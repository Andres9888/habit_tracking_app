/**
 * useLoadAudio - Audio loading and unloading
 *
 * Handles loading audio from URI and cleanup.
 */

import { useCallback } from 'react';
import {
  createAudioPlayer,
  type AudioPlayer,
  type AudioStatus,
} from 'expo-audio';
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
  soundRef: React.MutableRefObject<AudioPlayer | null>;
  wasPlayingBeforeInterruptionRef: React.MutableRefObject<boolean>;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  configureAudioMode: () => Promise<void>;
  onPlaybackStatusUpdate: (status: AudioStatus) => void;
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
          soundRef.current.remove();
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
        const player = createAudioPlayer(
          { uri },
          { updateInterval: STATUS_UPDATE_INTERVAL_MS }
        );
        player.addListener('playbackStatusUpdate', onPlaybackStatusUpdate);
        soundRef.current = player;
        if (autoPlayOnLoad) player.play();

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
        soundRef.current.remove();
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
