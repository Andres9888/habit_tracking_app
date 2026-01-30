/**
 * useAudioPlayback Types
 *
 * Type definitions for the audio playback hook.
 */

/**
 * Playback speed options
 */
export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

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

export type InterruptionReason = 'phone-call' | 'other-app' | 'system';

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
  interruptionReason: InterruptionReason | null;
}

export interface UseAudioPlaybackOptions {
  autoPlayOnLoad?: boolean;
  onFinish?: () => void;
  onError?: (error: Error) => void;
  onInterrupted?: (reason: InterruptionReason) => void;
  onInterruptionEnded?: () => void;
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
