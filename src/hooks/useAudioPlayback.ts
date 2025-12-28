/**
 * useAudioPlayback Hook
 * Audio playback integration using expo-av
 *
 * This hook provides a complete audio playback interface for the Voice Notes feature.
 * It handles:
 * - Loading audio from URI
 * - Playback controls (play, pause, seek)
 * - Progress tracking with position/duration
 * - Playback speed control (0.5x, 1x, 1.5x, 2x)
 * - Error handling for playback failures
 * - Audio interruption handling
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 *
 * Story T10.4: Playback UI with progress bar
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

/**
 * Playback speed options
 */
export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/**
 * Status update interval in milliseconds for smooth progress bar updates
 */
const STATUS_UPDATE_INTERVAL_MS = 100;

export type PlaybackState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'seeking'
  | 'error'
  | 'finished';

export interface PlaybackStatus {
  /** Current playback state */
  state: PlaybackState;
  /** Current playback position in seconds */
  positionSeconds: number;
  /** Total duration in seconds */
  durationSeconds: number;
  /** Progress percentage (0-1) */
  progress: number;
  /** Current playback speed */
  speed: PlaybackSpeed;
  /** Whether the audio is muted */
  isMuted: boolean;
  /** Whether playback finished naturally */
  didJustFinish: boolean;
  /** Error message if state is 'error' */
  errorMessage: string | null;
  /** URI of the currently loaded audio */
  audioUri: string | null;
}

export interface UseAudioPlaybackReturn {
  /** Current playback status */
  status: PlaybackStatus;
  /** Load audio from URI */
  loadAudio: (uri: string) => Promise<void>;
  /** Unload the current audio */
  unloadAudio: () => Promise<void>;
  /** Start or resume playback */
  play: () => Promise<void>;
  /** Pause playback */
  pause: () => Promise<void>;
  /** Toggle between play and pause */
  togglePlayPause: () => Promise<void>;
  /** Seek to a specific position (0-1 progress) */
  seekToProgress: (progress: number) => Promise<void>;
  /** Seek to a specific position in seconds */
  seekToSeconds: (seconds: number) => Promise<void>;
  /** Seek forward by a number of seconds */
  seekForward: (seconds?: number) => Promise<void>;
  /** Seek backward by a number of seconds */
  seekBackward: (seconds?: number) => Promise<void>;
  /** Set playback speed */
  setSpeed: (speed: PlaybackSpeed) => Promise<void>;
  /** Toggle mute */
  toggleMute: () => Promise<void>;
  /** Replay from beginning */
  replay: () => Promise<void>;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Whether audio is loaded and ready */
  isReady: boolean;
  /** Whether audio is currently loading */
  isLoading: boolean;
  /** Formatted position string (MM:SS) */
  formattedPosition: string;
  /** Formatted duration string (MM:SS) */
  formattedDuration: string;
  /** Formatted remaining time string (MM:SS) */
  formattedRemaining: string;
}

/**
 * Format seconds as MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if status is a success status with required fields
 */
function isPlaybackStatusSuccess(
  status: AVPlaybackStatus
): status is AVPlaybackStatusSuccess {
  return status.isLoaded;
}

/**
 * useAudioPlayback hook for voice notes playback
 *
 * @param options - Configuration options
 * @param options.autoPlayOnLoad - Whether to auto-play when audio is loaded
 * @param options.onFinish - Callback when playback finishes
 * @param options.onError - Callback for error handling
 */
export function useAudioPlayback(options?: {
  autoPlayOnLoad?: boolean;
  onFinish?: () => void;
  onError?: (error: Error) => void;
}): UseAudioPlaybackReturn {
  const { autoPlayOnLoad = false, onFinish, onError } = options || {};

  // Sound instance ref
  const soundRef = useRef<Audio.Sound | null>(null);

  // Status state
  const [status, setStatus] = useState<PlaybackStatus>({
    audioUri: null,
    didJustFinish: false,
    durationSeconds: 0,
    errorMessage: null,
    isMuted: false,
    positionSeconds: 0,
    progress: 0,
    speed: 1,
    state: 'idle',
  });

  /**
   * Handle playback status updates
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
    [onFinish, onError]
  );

  /**
   * Configure audio mode for playback
   */
  const configureAudioMode = useCallback(async (): Promise<void> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });
  }, []);

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
    [configureAudioMode, autoPlayOnLoad, onPlaybackStatusUpdate, onError]
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

    setStatus({
      audioUri: null,
      didJustFinish: false,
      durationSeconds: 0,
      errorMessage: null,
      isMuted: false,
      positionSeconds: 0,
      progress: 0,
      speed: 1,
      state: 'idle',
    });
  }, []);

  /**
   * Start or resume playback
   */
  const play = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      // If finished, replay from beginning
      if (status.state === 'finished') {
        await soundRef.current.setPositionAsync(0);
      }

      await soundRef.current.playAsync();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to play';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [status.state, onError]);

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
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [onError]);

  /**
   * Toggle between play and pause
   */
  const togglePlayPause = useCallback(async (): Promise<void> => {
    await (status.state === 'playing' ? pause() : play());
  }, [status.state, play, pause]);

  /**
   * Seek to a specific position (0-1 progress)
   */
  const seekToProgress = useCallback(
    async (progress: number): Promise<void> => {
      if (!soundRef.current || status.durationSeconds === 0) return;

      try {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        const positionMillis = clampedProgress * status.durationSeconds * 1000;

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
    [status.durationSeconds, onError]
  );

  /**
   * Seek to a specific position in seconds
   */
  const seekToSeconds = useCallback(
    async (seconds: number): Promise<void> => {
      if (!soundRef.current) return;

      try {
        const clampedSeconds = Math.min(
          status.durationSeconds,
          Math.max(0, seconds)
        );
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
    [status.durationSeconds, onError]
  );

  /**
   * Seek forward by a number of seconds
   */
  const seekForward = useCallback(
    async (seconds: number = 10): Promise<void> => {
      const newPosition = Math.min(
        status.positionSeconds + seconds,
        status.durationSeconds
      );
      await seekToSeconds(newPosition);
    },
    [status.positionSeconds, status.durationSeconds, seekToSeconds]
  );

  /**
   * Seek backward by a number of seconds
   */
  const seekBackward = useCallback(
    async (seconds: number = 10): Promise<void> => {
      const newPosition = Math.max(status.positionSeconds - seconds, 0);
      await seekToSeconds(newPosition);
    },
    [status.positionSeconds, seekToSeconds]
  );

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
    [onError]
  );

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(async (): Promise<void> => {
    if (!soundRef.current) return;

    try {
      const newMuted = !status.isMuted;
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
  }, [status.isMuted, onError]);

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
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, []);

  // Derived states
  const isPlaying = status.state === 'playing';
  const isReady =
    status.state === 'ready' ||
    status.state === 'playing' ||
    status.state === 'paused' ||
    status.state === 'finished';
  const isLoading = status.state === 'loading';
  const formattedPosition = formatDuration(status.positionSeconds);
  const formattedDuration = formatDuration(status.durationSeconds);
  const remainingSeconds = status.durationSeconds - status.positionSeconds;
  const formattedRemaining = `-${formatDuration(Math.max(0, remainingSeconds))}`;

  return {
    formattedDuration,
    formattedPosition,
    formattedRemaining,
    isLoading,
    isPlaying,
    isReady,
    loadAudio,
    pause,
    play,
    replay,
    seekBackward,
    seekForward,
    seekToProgress,
    seekToSeconds,
    setSpeed,
    status,
    toggleMute,
    togglePlayPause,
    unloadAudio,
  };
}

export default useAudioPlayback;
