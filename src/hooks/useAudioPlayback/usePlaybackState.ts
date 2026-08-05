/**
 * usePlaybackState - State management for audio playback
 *
 * Manages the playback status state and provides setter functions.
 */

import { useState, useRef } from 'react';
import type { AudioPlayer } from 'expo-audio';
import { AppState, AppStateStatus } from 'react-native';
import type { PlaybackStatus } from './types';
import { INITIAL_PLAYBACK_STATUS } from './constants';

export interface UsePlaybackStateReturn {
  status: PlaybackStatus;
  setStatus: React.Dispatch<React.SetStateAction<PlaybackStatus>>;
  soundRef: React.MutableRefObject<AudioPlayer | null>;
  wasPlayingBeforeInterruptionRef: React.MutableRefObject<boolean>;
  previousAppStateRef: React.MutableRefObject<AppStateStatus>;
}

/**
 * Hook for managing audio playback state
 */
export function usePlaybackState(): UsePlaybackStateReturn {
  const [status, setStatus] = useState<PlaybackStatus>(INITIAL_PLAYBACK_STATUS);

  // Sound instance ref
  const soundRef = useRef<AudioPlayer | null>(null);

  // Track if we were playing when interrupted (for resumption)
  const wasPlayingBeforeInterruptionRef = useRef<boolean>(false);

  // Track the previous app state for interruption detection
  const previousAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  return {
    previousAppStateRef,
    setStatus,
    soundRef,
    status,
    wasPlayingBeforeInterruptionRef,
  };
}
