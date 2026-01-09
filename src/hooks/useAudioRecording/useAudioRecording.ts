/**
 * useAudioRecording Hook - Main orchestrator
 *
 * Audio recording integration using expo-av for Voice Notes feature.
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import type {
  UseAudioRecordingOptions,
  UseAudioRecordingReturn,
} from './types';
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
import { useAppStateInterruption } from './useAppStateInterruption';
import { useRecordingSettingsHelpers } from './useRecordingSettingsHelpers';
import { buildReturnValue } from './buildReturnValue';

export function useAudioRecording(
  options?: UseAudioRecordingOptions
): UseAudioRecordingReturn {
  const opts = { ...options };
  const maxDuration = opts.maxDurationSeconds ?? MAX_RECORDING_DURATION_SECONDS;
  const warningThreshold =
    opts.warningThresholdSeconds ?? DEFAULT_WARNING_THRESHOLD_SECONDS;

  const [status, setStatus] = useState(INITIAL_RECORDING_STATUS);
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

  useAppStateInterruption({
    currentState: status.state,
    handleInterruption,
    onInterruptionEnded: opts.onInterruptionEnded,
  });

  useEffect(() => {
    return () => {
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  const { reset, openSettings, showPermissionAlert } =
    useRecordingSettingsHelpers({
      onOpenSettings: opts.onOpenSettings,
      resetRefs,
      setStatus,
    });

  return buildReturnValue({
    cancelRecording,
    maxDuration,
    openSettings,
    pauseRecording,
    requestPermission,
    reset,
    resumeFromInterruption,
    resumeRecording,
    showPermissionAlert,
    startRecording,
    status,
    stopRecording,
  });
}

export default useAudioRecording;
