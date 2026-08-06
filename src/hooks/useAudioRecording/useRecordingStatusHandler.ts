/**
 * Hook for handling recording status updates from expo-audio
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { useCallback, useEffect, useRef } from 'react';
import type { RecorderState } from 'expo-audio';
import type { RecordingState } from './types';
import type {
  SetStatus,
  UseRecordingStatusHandlerOptions,
} from './useRecordingStatusHandler.types';

export function useRecordingStatusHandler(
  setStatus: SetStatus,
  currentState: RecordingState,
  options: UseRecordingStatusHandlerOptions
) {
  const {
    maxDurationSeconds,
    warningThresholdSeconds,
    onMaxDurationReached,
    onWarningThresholdReached,
    onInterrupted,
  } = options;

  const durationRef = useRef<number>(0);
  const warningFiredRef = useRef<boolean>(false);
  const wasRecordingBeforeInterruptionRef = useRef<boolean>(false);
  const currentStateRef = useRef(currentState);

  useEffect(() => {
    currentStateRef.current = currentState;
  }, [currentState]);

  const handleInterruption = useCallback(
    (reason: 'phone-call' | 'other-app' | 'system') => {
      if (currentStateRef.current !== 'recording') return;
      wasRecordingBeforeInterruptionRef.current = true;
      setStatus((prev) => ({
        ...prev,
        interruptionReason: reason,
        state: 'interrupted',
        wasInterrupted: true,
      }));
      onInterrupted?.(reason);
    },
    [onInterrupted, setStatus]
  );

  const onRecordingStatusUpdate = useCallback(
    (recordingStatus: RecorderState) => {
      // Detect unexpected pause (interruption)
      if (
        !recordingStatus.isRecording &&
        recordingStatus.durationMillis &&
        recordingStatus.durationMillis > 0 &&
        currentStateRef.current === 'recording'
      ) {
        handleInterruption('system');
        return;
      }

      if (!recordingStatus.isRecording) return;
      if (currentStateRef.current !== 'recording') return;

      const durationSeconds = Math.floor(
        (recordingStatus.durationMillis || 0) / 1000
      );
      durationRef.current = durationSeconds;

      // Normalize metering from dB (-160 to 0) to 0-1 range
      const metering = recordingStatus.metering ?? -160;
      const normalizedMetering = Math.max(
        0,
        Math.min(1, (metering + 160) / 160)
      );

      // Calculate warning threshold status
      const warningStartTime = maxDurationSeconds - warningThresholdSeconds;
      const isApproachingMax = durationSeconds >= warningStartTime;
      const secondsRemaining = isApproachingMax
        ? maxDurationSeconds - durationSeconds
        : null;

      // Fire warning callback once per recording
      if (isApproachingMax && !warningFiredRef.current) {
        warningFiredRef.current = true;
        onWarningThresholdReached?.(
          secondsRemaining ?? warningThresholdSeconds
        );
      }

      setStatus((prev) => ({
        ...prev,
        durationSeconds,
        isApproachingMaxDuration: isApproachingMax,
        meteringLevel: normalizedMetering,
        secondsUntilMaxDuration: secondsRemaining,
      }));

      if (durationSeconds >= maxDurationSeconds) onMaxDurationReached?.();
    },
    [
      maxDurationSeconds,
      warningThresholdSeconds,
      onMaxDurationReached,
      onWarningThresholdReached,
      handleInterruption,
      setStatus,
    ]
  );

  const resetRefs = useCallback(() => {
    durationRef.current = 0;
    warningFiredRef.current = false;
    wasRecordingBeforeInterruptionRef.current = false;
  }, []);

  return {
    durationRef,
    handleInterruption,
    onRecordingStatusUpdate,
    resetRefs,
    wasRecordingBeforeInterruptionRef,
  };
}
