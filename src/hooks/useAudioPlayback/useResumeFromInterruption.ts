/**
 * useResumeFromInterruption - Resume playback after interruption
 *
 * Handles resuming audio playback after external interruptions.
 */

import { useCallback } from 'react';
import { Audio } from 'expo-av';
import type { PlaybackState, PlaybackStatus } from './types';

export interface UseResumeFromInterruptionOptions {
  onError?: (error: Error) => void;
  onInterruptionEnded?: () => void;
}

export interface UseResumeFromInterruptionDeps {
  soundRef: React.MutableRefObject<Audio.Sound | null>;
  wasPlayingBeforeInterruptionRef: React.MutableRefObject<boolean>;
  currentState: PlaybackState;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  configureAudioMode: () => Promise<void>;
}

export interface UseResumeFromInterruptionReturn {
  resumeFromInterruption: () => Promise<void>;
}

/**
 * Hook for resuming playback after an interruption
 */
export function useResumeFromInterruption(
  deps: UseResumeFromInterruptionDeps,
  options: UseResumeFromInterruptionOptions
): UseResumeFromInterruptionReturn {
  const {
    soundRef,
    wasPlayingBeforeInterruptionRef,
    currentState,
    setStatus,
    configureAudioMode,
  } = deps;
  const { onError, onInterruptionEnded } = options;

  /**
   * Resume playback after an interruption
   */
  const resumeFromInterruption = useCallback(async (): Promise<void> => {
    if (!soundRef.current || currentState !== 'interrupted') {
      return;
    }

    try {
      // Reconfigure audio mode in case it was modified by the interrupting app
      await configureAudioMode();

      // Resume playback
      await soundRef.current.playAsync();

      // Clear interruption state
      wasPlayingBeforeInterruptionRef.current = false;

      setStatus((prev) => ({
        ...prev,
        interruptionReason: null,
        state: 'playing',
        // Keep wasInterrupted true for analytics/UX purposes
      }));

      onInterruptionEnded?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resume after interruption';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    currentState,
    configureAudioMode,
    onInterruptionEnded,
    onError,
    soundRef,
    wasPlayingBeforeInterruptionRef,
    setStatus,
  ]);

  return { resumeFromInterruption };
}
