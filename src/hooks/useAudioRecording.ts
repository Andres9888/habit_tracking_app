/**
 * useAudioRecording Hook
 * Audio recording integration using expo-av
 *
 * This hook provides a complete audio recording interface for the Voice Notes feature.
 * It handles:
 * - Permission requests for microphone access
 * - Audio mode configuration for recording
 * - Recording start/stop/pause/resume
 * - Recording status updates (duration, metering levels)
 * - Error handling for permission denial and recording failures
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform, Linking, Alert } from 'react-native';

/**
 * Recording quality preset optimized for voice notes
 * Uses AAC codec with reasonable quality settings for file size vs quality balance
 */
const RECORDING_OPTIONS = {
  android: {
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    bitRate: 128_000,
    extension: '.m4a',
    numberOfChannels: 1,
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    sampleRate: 44_100,
  },
  ios: {
    audioQuality: Audio.IOSAudioQuality.HIGH,
    bitRate: 128_000,
    extension: '.m4a',
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    numberOfChannels: 1,
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    sampleRate: 44_100,
  },
  web: {
    bitsPerSecond: 128_000,
    mimeType: 'audio/webm',
  },
};

/**
 * Maximum recording duration in seconds (5 minutes as per spec)
 */
const MAX_RECORDING_DURATION_SECONDS = 300;

/**
 * Opens the device settings app so user can grant microphone permission
 * Uses platform-specific URL schemes
 */
export function openMicrophoneSettings(): void {
  if (Platform.OS === 'ios') {
    // On iOS, app-settings: opens the app's settings page directly
    Linking.openURL('app-settings:');
  } else {
    // On Android, openSettings() opens the app details page
    Linking.openSettings();
  }
}

/**
 * Shows an alert when microphone permission is denied
 * Provides option to open Settings
 */
export function showMicrophonePermissionAlert(options?: {
  title?: string;
  message?: string;
  onOpenSettings?: () => void;
  onCancel?: () => void;
}): void {
  const {
    title = 'Microphone Access Required',
    message = 'To record voice notes, please allow microphone access in your device Settings.',
    onOpenSettings,
    onCancel,
  } = options || {};

  Alert.alert(title, message, [
    {
      onPress: onCancel,
      style: 'cancel',
      text: 'Cancel',
    },
    {
      onPress: () => {
        openMicrophoneSettings();
        onOpenSettings?.();
      },
      text: 'Open Settings',
    },
  ]);
}

/**
 * Recording status update interval in milliseconds
 */
const STATUS_UPDATE_INTERVAL_MS = 100;

export type RecordingState =
  | 'idle'
  | 'requesting-permission'
  | 'permission-denied'
  | 'preparing'
  | 'recording'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'error';

export interface RecordingStatus {
  /** Current recording state */
  state: RecordingState;
  /** Recording duration in seconds */
  durationSeconds: number;
  /** Audio metering level (0-1) for visualization */
  meteringLevel: number;
  /** Whether microphone permission has been granted */
  hasPermission: boolean | null;
  /** Whether user has permanently denied permission (selected "Don't ask again" on Android) */
  canAskAgain: boolean;
  /** Error message if state is 'error' or 'permission-denied' */
  errorMessage: string | null;
  /** URI of the recording file when stopped */
  recordingUri: string | null;
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
  /** Whether recording can be started */
  canStartRecording: boolean;
  /** Formatted duration string (MM:SS) */
  formattedDuration: string;
  /** Whether max duration has been reached */
  isMaxDurationReached: boolean;
}

/**
 * Format seconds as MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * useAudioRecording hook for voice notes recording
 *
 * @param options - Configuration options
 * @param options.maxDurationSeconds - Maximum recording duration (default: 300 seconds / 5 minutes)
 * @param options.onMaxDurationReached - Callback when max duration is reached
 * @param options.onRecordingComplete - Callback when recording is stopped with the file URI
 * @param options.onError - Callback for error handling
 * @param options.onPermissionDenied - Callback when microphone permission is denied
 * @param options.onOpenSettings - Callback when user opens settings
 */
export function useAudioRecording(options?: {
  maxDurationSeconds?: number;
  onMaxDurationReached?: () => void;
  onRecordingComplete?: (uri: string, durationSeconds: number) => void;
  onError?: (error: Error) => void;
  onPermissionDenied?: (canAskAgain: boolean) => void;
  onOpenSettings?: () => void;
}): UseAudioRecordingReturn {
  const {
    maxDurationSeconds = MAX_RECORDING_DURATION_SECONDS,
    onMaxDurationReached,
    onRecordingComplete,
    onError,
    onPermissionDenied,
    onOpenSettings,
  } = options || {};

  // Recording instance ref
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Status state
  const [status, setStatus] = useState<RecordingStatus>({
    canAskAgain: true,
    durationSeconds: 0,
    errorMessage: null,
    hasPermission: null,
    meteringLevel: 0,
    recordingUri: null,
    state: 'idle',
  });

  // Duration tracking ref (to avoid stale closure issues)
  const durationRef = useRef<number>(0);

  /**
   * Request microphone permission
   * Returns true if granted, false otherwise
   * Updates status with permission state and canAskAgain flag
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setStatus((prev) => ({
        ...prev,
        errorMessage: null,
        state: 'requesting-permission',
      }));

      const permissionResponse = await Audio.requestPermissionsAsync();
      const { granted, canAskAgain } = permissionResponse;

      setStatus((prev) => ({
        ...prev,
        canAskAgain: canAskAgain ?? true,
        errorMessage: granted
          ? null
          : canAskAgain
            ? 'Microphone permission denied. Please try again.'
            : 'Microphone permission denied. Please enable it in Settings.',
        hasPermission: granted,
        state: granted ? 'idle' : 'permission-denied',
      }));

      if (!granted) {
        onPermissionDenied?.(canAskAgain ?? true);
      }

      return granted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to request permission';
      setStatus((prev) => ({
        ...prev,
        canAskAgain: true,
        errorMessage,
        hasPermission: false,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return false;
    }
  }, [onError, onPermissionDenied]);

  /**
   * Configure audio mode for recording
   */
  const configureAudioMode = useCallback(async (): Promise<void> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,

      playThroughEarpieceAndroid: false,

      // Android-specific
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });
  }, []);

  /**
   * Handle recording status updates
   */
  const onRecordingStatusUpdate = useCallback(
    (recordingStatus: Audio.RecordingStatus) => {
      if (recordingStatus.isRecording) {
        const durationSeconds = Math.floor(
          (recordingStatus.durationMillis || 0) / 1000
        );
        durationRef.current = durationSeconds;

        // Calculate metering level (0-1 from dB)
        // expo-av provides metering as dB, typically -160 to 0
        const metering = recordingStatus.metering ?? -160;
        const normalizedMetering = Math.max(
          0,
          Math.min(1, (metering + 160) / 160)
        );

        setStatus((prev) => ({
          ...prev,
          durationSeconds,
          meteringLevel: normalizedMetering,
        }));

        // Check if max duration reached
        if (durationSeconds >= maxDurationSeconds) {
          onMaxDurationReached?.();
        }
      }
    },
    [maxDurationSeconds, onMaxDurationReached]
  );

  /**
   * Start a new recording
   */
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Check/request permission first
      let hasPermission = status.hasPermission;
      if (hasPermission === null) {
        hasPermission = await requestPermission();
      }

      if (!hasPermission) {
        setStatus((prev) => ({
          ...prev,
          errorMessage: 'Microphone permission required',
          state: 'permission-denied',
        }));
        return;
      }

      setStatus((prev) => ({
        ...prev,
        durationSeconds: 0,
        errorMessage: null,
        meteringLevel: 0,
        recordingUri: null,
        state: 'preparing',
      }));

      // Configure audio mode
      await configureAudioMode();

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS,
        onRecordingStatusUpdate,
        STATUS_UPDATE_INTERVAL_MS
      );

      recordingRef.current = recording;
      durationRef.current = 0;

      setStatus((prev) => ({
        ...prev,
        state: 'recording',
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start recording';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    status.hasPermission,
    requestPermission,
    configureAudioMode,
    onRecordingStatusUpdate,
    onError,
  ]);

  /**
   * Stop the current recording and return the file URI
   */
  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) {
      return null;
    }

    try {
      setStatus((prev) => ({
        ...prev,
        state: 'stopping',
      }));

      // Stop and unload the recording
      await recordingRef.current.stopAndUnloadAsync();

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Get the URI
      const uri = recordingRef.current.getURI();
      const finalDuration = durationRef.current;

      recordingRef.current = null;

      setStatus((prev) => ({
        ...prev,
        recordingUri: uri,
        state: 'stopped',
      }));

      if (uri) {
        onRecordingComplete?.(uri, finalDuration);
      }

      return uri;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to stop recording';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, [onRecordingComplete, onError]);

  /**
   * Pause the current recording
   */
  const pauseRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current || status.state !== 'recording') {
      return;
    }

    try {
      await recordingRef.current.pauseAsync();
      setStatus((prev) => ({
        ...prev,
        state: 'paused',
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to pause recording';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [status.state, onError]);

  /**
   * Resume a paused recording
   */
  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current || status.state !== 'paused') {
      return;
    }

    try {
      await recordingRef.current.startAsync();
      setStatus((prev) => ({
        ...prev,
        state: 'recording',
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to resume recording';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [status.state, onError]);

  /**
   * Cancel the current recording without saving
   */
  const cancelRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current) {
      return;
    }

    try {
      // Stop and unload without saving the URI
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // Recording might already be stopped
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      recordingRef.current = null;
      durationRef.current = 0;

      setStatus({
        canAskAgain: status.canAskAgain,
        durationSeconds: 0,
        errorMessage: null,
        hasPermission: status.hasPermission,
        meteringLevel: 0,
        recordingUri: null,
        state: 'idle',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel recording';
      setStatus((prev) => ({
        ...prev,
        errorMessage,
        state: 'error',
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [status.hasPermission, status.canAskAgain, onError]);

  /**
   * Reset state to idle
   */
  const reset = useCallback(() => {
    setStatus({
      canAskAgain: status.canAskAgain,
      durationSeconds: 0,
      errorMessage: null,
      hasPermission: status.hasPermission,
      meteringLevel: 0,
      recordingUri: null,
      state: 'idle',
    });
    durationRef.current = 0;
  }, [status.hasPermission, status.canAskAgain]);

  /**
   * Open device settings to enable microphone permission
   */
  const openSettings = useCallback(() => {
    openMicrophoneSettings();
    onOpenSettings?.();
  }, [onOpenSettings]);

  /**
   * Show an alert prompting user to grant permission in settings
   */
  const showPermissionAlert = useCallback(() => {
    showMicrophonePermissionAlert({
      onOpenSettings,
    });
  }, [onOpenSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, []);

  // Derived states
  const isRecording = status.state === 'recording';
  const isPaused = status.state === 'paused';
  const canStartRecording =
    status.state === 'idle' || status.state === 'stopped';
  const formattedDuration = formatDuration(status.durationSeconds);
  const isMaxDurationReached = status.durationSeconds >= maxDurationSeconds;

  return {
    cancelRecording,
    canStartRecording,
    formattedDuration,
    isMaxDurationReached,
    isPaused,
    isRecording,
    openSettings,
    pauseRecording,
    requestPermission,
    reset,
    resumeRecording,
    showPermissionAlert,
    startRecording,
    status,
    stopRecording,
  };
}

export default useAudioRecording;
