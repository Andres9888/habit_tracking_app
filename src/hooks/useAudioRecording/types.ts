/**
 * Type definitions for useAudioRecording hook
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

export type RecordingState =
  | 'idle'
  | 'requesting-permission'
  | 'permission-denied'
  | 'preparing'
  | 'recording'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'interrupted'
  | 'error';

export type InterruptionReason = 'phone-call' | 'other-app' | 'system' | null;

export interface RecordingStatus {
  /** Current recording state */
  state: RecordingState;
  /** Recording duration in seconds */
  durationSeconds: number;
  /** Audio metering level (0-1) for visualization */
  meteringLevel: number;
  /** Whether microphone permission has been granted */
  hasPermission: boolean | null;
  /** Whether user has permanently denied permission (selected "Don't ask again" on Native Handset) */
  canAskAgain: boolean;
  /** Error message if state is 'error' or 'permission-denied' */
  errorMessage: string | null;
  /** URI of the recording file when stopped */
  recordingUri: string | null;
  /** Whether approaching max duration (warning threshold reached) */
  isApproachingMaxDuration: boolean;
  /** Seconds remaining until max duration (only set when isApproachingMaxDuration is true) */
  secondsUntilMaxDuration: number | null;
  /** Whether recording was interrupted by another audio source (phone call, other app) */
  wasInterrupted: boolean;
  /** Reason for interruption if interrupted */
  interruptionReason: InterruptionReason;
}

export interface UseAudioRecordingOptions {
  maxDurationSeconds?: number;
  warningThresholdSeconds?: number;
  onMaxDurationReached?: () => void;
  onWarningThresholdReached?: (secondsRemaining: number) => void;
  onRecordingComplete?: (uri: string, durationSeconds: number) => void;
  onError?: (error: Error) => void;
  onPermissionDenied?: (canAskAgain: boolean) => void;
  onOpenSettings?: () => void;
  onInterrupted?: (reason: 'phone-call' | 'other-app' | 'system') => void;
  onInterruptionEnded?: () => void;
}

export interface UseAudioRecordingReturn {
  /** Current recording status */
  status: RecordingStatus;
  /** Start a new recording */
  startRecording: () => Promise<void>;
  /** Stop the current recording */
  stopRecording: () => Promise<string | null>;
  /** Pause the current recording */
  pauseRecording: () => Promise<void>;
  /** Resume a paused recording */
  resumeRecording: () => Promise<void>;
  /** Resume after an interruption (phone call, other app) */
  resumeFromInterruption: () => Promise<void>;
  /** Cancel the current recording without saving */
  cancelRecording: () => Promise<void>;
  /** Check and request microphone permission */
  requestPermission: () => Promise<boolean>;
  /** Open device settings to grant microphone permission */
  openSettings: () => void;
  /** Show alert prompting user to grant permission in settings */
  showPermissionAlert: () => void;
  /** Reset state to idle (for starting a new recording) */
  reset: () => void;
  /** Whether recording is currently active */
  isRecording: boolean;
  /** Whether recording is paused */
  isPaused: boolean;
  /** Whether recording was interrupted */
  isInterrupted: boolean;
  /** Whether recording can be started */
  canStartRecording: boolean;
  /** Formatted duration string (MM:SS) */
  formattedDuration: string;
  /** Whether max duration has been reached */
  isMaxDurationReached: boolean;
  /** Whether approaching max duration (warning active) */
  isApproachingMaxDuration: boolean;
  /** Seconds remaining until max duration (when warning is active) */
  secondsUntilMaxDuration: number | null;
}
