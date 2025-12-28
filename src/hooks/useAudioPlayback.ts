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
import {
  Audio,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from 'expo-av';
import { AppState, AppStateStatus } from 'react-native';

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
  | 'interrupted'
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
  /** Whether playback was interrupted by another audio source */
  wasInterrupted: boolean;
  /** Reason for interruption if interrupted */
  interruptionReason: 'phone-call' | 'other-app' | 'system' | null;
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
  /** Resume playback after an interruption */
  resumeFromInterruption: () => Promise<void>;
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
  /** Whether audio was interrupted */
  isInterrupted: boolean;
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
 * @param options.onInterrupted - Callback when playback is interrupted by phone call or other app
 * @param options.onInterruptionEnded - Callback when interruption ends (user can resume)
 */
export function useAudioPlayback(options?: {
  autoPlayOnLoad?: boolean;
  onFinish?: () => void;
  onError?: (error: Error) => void;
  onInterrupted?: (reason: 'phone-call' | 'other-app' | 'system') => void;
  onInterruptionEnded?: () => void;
}): UseAudioPlaybackReturn {
  const {
    autoPlayOnLoad = false,
    onFinish,
    onError,
    onInterrupted,
    onInterruptionEnded,
  } = options || {};

  // Sound instance ref
  const soundRef = useRef<Audio.Sound | null>(null);

  // Track if we were playing when interrupted (for resumption)
  const wasPlayingBeforeInterruptionRef = useRef<boolean>(false);

  // Track the previous app state for interruption detection
  const previousAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Status state
  const [status, setStatus] = useState<PlaybackStatus>({
    audioUri: null,
    didJustFinish: false,
    durationSeconds: 0,
    errorMessage: null,
    interruptionReason: null,
    isMuted: false,
    positionSeconds: 0,
    progress: 0,
    speed: 1,
    state: 'idle',
    wasInterrupted: false,
  });

  /**
   * Handle audio interruption (phone call, other app taking audio focus)
   * @param reason - The reason for the interruption
   */
  const handleInterruption = useCallback(
    (reason: 'phone-call' | 'other-app' | 'system') => {
      // Only handle if we're currently playing
      if (status.state !== 'playing') return;

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
    [status.state, onInterrupted]
  );

  /**
   * Handle playback status updates
   * Also detects audio interruptions by monitoring isPlaying state changes
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
      if (
        !playbackStatus.isPlaying &&
        !playbackStatus.didJustFinish &&
        status.state === 'playing'
      ) {
        // Playback was unexpectedly paused - this is an interruption
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
    [status.state, onFinish, onError, handleInterruption]
  );

  /**
   * Configure audio mode for playback
   * Sets up interruption handling so playback pauses during phone calls or other app audio
   */
  const configureAudioMode = useCallback(async (): Promise<void> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,

      // Android: Do not mix with other audio - pause when interrupted
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,

      // iOS: Do not mix with other audio - pause when interrupted
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,

      playsInSilentModeIOS: true,

      // Android-specific
      playThroughEarpieceAndroid: false,

      shouldDuckAndroid: false,

      // Don't duck, pause completely
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

    wasPlayingBeforeInterruptionRef.current = false;

    setStatus({
      audioUri: null,
      didJustFinish: false,
      durationSeconds: 0,
      errorMessage: null,
      interruptionReason: null,
      isMuted: false,
      positionSeconds: 0,
      progress: 0,
      speed: 1,
      state: 'idle',
      wasInterrupted: false,
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
   * Resume playback after an interruption (phone call, other app)
   * Clears the interruption state and resumes playback
   */
  const resumeFromInterruption = useCallback(async (): Promise<void> => {
    if (!soundRef.current || status.state !== 'interrupted') {
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
  }, [status.state, configureAudioMode, onInterruptionEnded, onError]);

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

  /**
   * AppState listener for detecting when app goes to background/foreground
   * This helps detect interruptions from phone calls or other apps
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = previousAppStateRef.current;

      // App went to background while playing - potential interruption
      if (
        previousState === 'active' &&
        (nextAppState === 'background' || nextAppState === 'inactive') &&
        status.state === 'playing'
      ) {
        // On iOS, 'inactive' often means phone call or other interruption
        const reason: 'phone-call' | 'other-app' | 'system' =
          nextAppState === 'inactive' ? 'phone-call' : 'other-app';
        handleInterruption(reason);
      }

      // App came back to foreground after being interrupted
      if (
        (previousState === 'background' || previousState === 'inactive') &&
        nextAppState === 'active' &&
        status.state === 'interrupted'
      ) {
        // Notify that interruption has ended - user can now resume
        onInterruptionEnded?.();
      }

      previousAppStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [status.state, handleInterruption, onInterruptionEnded]);

  // Derived states
  const isPlaying = status.state === 'playing';
  const isReady =
    status.state === 'ready' ||
    status.state === 'playing' ||
    status.state === 'paused' ||
    status.state === 'finished';
  const isLoading = status.state === 'loading';
  const isInterrupted = status.state === 'interrupted';
  const formattedPosition = formatDuration(status.positionSeconds);
  const formattedDuration = formatDuration(status.durationSeconds);
  const remainingSeconds = status.durationSeconds - status.positionSeconds;
  const formattedRemaining = `-${formatDuration(Math.max(0, remainingSeconds))}`;

  return {
    formattedDuration,
    formattedPosition,
    formattedRemaining,
    isInterrupted,
    isLoading,
    isPlaying,
    isReady,
    loadAudio,
    pause,
    play,
    replay,
    resumeFromInterruption,
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
