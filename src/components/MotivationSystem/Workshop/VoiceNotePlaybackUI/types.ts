/**
 * Type definitions for VoiceNotePlaybackUI components
 */

import { PlaybackSpeed } from '../../../../hooks/useAudioPlayback';

/**
 * Props for the main VoiceNotePlaybackUI component
 */
export interface VoiceNotePlaybackUIProps {
  /** URI of the audio file to play */
  audioUri: string;
  /** Optional label for the voice note */
  label?: string;
  /** Duration in seconds (for initial display before loading) */
  initialDuration?: number;
  /** Whether this is the Day 1 recording */
  isDay1?: boolean;
  /** Callback when playback starts */
  onPlayStart?: () => void;
  /** Callback when playback finishes */
  onPlayFinish?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Whether to show compact mode (less UI elements) */
  compact?: boolean;
  /** Whether to show speed controls */
  showSpeedControl?: boolean;
  /** Whether to show mute button */
  showMuteButton?: boolean;
}

/**
 * Props for the PlayPauseButton component
 */
export interface PlayPauseButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  isFinished: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
}

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps {
  progress: number;
  onSeek: (progress: number) => void;
  isDisabled?: boolean;
  reduceMotion?: boolean;
}

/**
 * Props for the SpeedControl component
 */
export interface SpeedControlProps {
  currentSpeed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

/**
 * Props for the ErrorState component
 */
export interface ErrorStateProps {
  errorMessage?: string | null;
  onRetry: () => void;
}

/**
 * Props for the PlaybackHeader component
 */
export interface PlaybackHeaderProps {
  label?: string;
  isDay1?: boolean;
}

/**
 * Props for the TimeControls component
 */
export interface TimeControlsProps {
  formattedPosition: string;
  formattedRemaining: string;
  displayDuration: string;
  isReady: boolean;
  showMuteButton: boolean;
  showSpeedControl: boolean;
  isMuted: boolean;
  currentSpeed: PlaybackSpeed;
  onToggleMute: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}
