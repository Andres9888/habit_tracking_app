/**
 * useRecordingHooks - Composes all recording sub-hooks
 */

import { useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { UseAudioRecordingOptions, RecordingStatus } from './types';
import {
  MAX_RECORDING_DURATION_SECONDS,
  DEFAULT_WARNING_THRESHOLD_SECONDS,
  INITIAL_RECORDING_STATUS,
} from './constants';
import { useRecordingPermission } from './useRecordingPermission';
import { useAudioMode } from './useAudioMode';
import { useRecordingStatusHandler } from './useRecordingStatusHandler';
import { useStartRecording } from './useStartRecording';
import { useStopRecording } from './useStopRecording';
import { useRecordingControl } from './useRecordingControl';
import { useRecordingSettingsHelpers } from './useRecordingSettingsHelpers';

export function useRecordingHooks(options?: UseAudioRecordingOptions) {
  const opts = { ...options };
  const maxDuration = opts.maxDurationSeconds ?? MAX_RECORDING_DURATION_SECONDS;
  const warningThreshold =
    opts.warningThresholdSeconds ?? DEFAULT_WARNING_THRESHOLD_SECONDS;

  const [status, setStatus] = useState<RecordingStatus>(
    INITIAL_RECORDING_STATUS
  );
  const recordingRef = useRef<Audio.Recording | null>(null);

  const { requestPermission } = useRecordingPermission(setStatus, {
    onError: opts.onError,
    onPermissionDenied: opts.onPermissionDenied,
  });

  const { configureAudioMode, resetAudioMode } = useAudioMode();

  const {
    durationRef,
    handleInterruption,
    onRecordingStatusUpdate,
    resetRefs,
    wasRecordingBeforeInterruptionRef,
  } = useRecordingStatusHandler(setStatus, status.state, {
    maxDurationSeconds: maxDuration,
    onInterrupted: opts.onInterrupted,
    onMaxDurationReached: opts.onMaxDurationReached,
    onWarningThresholdReached: opts.onWarningThresholdReached,
    warningThresholdSeconds: warningThreshold,
  });

  const { startRecording } = useStartRecording({
    configureAudioMode,
    durationRef,
    hasPermission: status.hasPermission,
    onError: opts.onError,
    onRecordingStatusUpdate,
    recordingRef,
    requestPermission,
    resetRefs,
    setStatus,
  });

  const { cancelRecording, stopRecording } = useStopRecording({
    durationRef,
    onError: opts.onError,
    onRecordingComplete: opts.onRecordingComplete,
    recordingRef,
    resetAudioMode,
    resetRefs,
    setStatus,
  });

  const { pauseRecording, resumeFromInterruption, resumeRecording } =
    useRecordingControl({
      configureAudioMode,
      currentState: status.state,
      onError: opts.onError,
      onInterruptionEnded: opts.onInterruptionEnded,
      recordingRef,
      setStatus,
      wasRecordingBeforeInterruptionRef,
    });

  const { reset, openSettings, showPermissionAlert } =
    useRecordingSettingsHelpers({
      onOpenSettings: opts.onOpenSettings,
      resetRefs,
      setStatus,
    });

  return {
    cancelRecording,
    handleInterruption,
    maxDuration,
    openSettings,
    pauseRecording,
    recordingRef,
    requestPermission,
    reset,
    resumeFromInterruption,
    resumeRecording,
    showPermissionAlert,
    startRecording,
    status,
    stopRecording,
  };
}
