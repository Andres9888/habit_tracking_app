/**
 * Hook for starting a new recording
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useCallback, RefObject } from 'react';
import { Audio } from 'expo-av';
import type { RecordingStatus } from './types';
import { RECORDING_OPTIONS, STATUS_UPDATE_INTERVAL_MS } from './constants';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseStartRecordingDeps {
  setStatus: SetStatus;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
  configureAudioMode: () => Promise<void>;
  onRecordingStatusUpdate: (status: Audio.RecordingStatus) => void;
  durationRef: RefObject<number>;
  resetRefs: () => void;
  recordingRef: RefObject<Audio.Recording | null>;
  onError?: (error: Error) => void;
}

export function useStartRecording(deps: UseStartRecordingDeps) {
  const {
    setStatus,
    hasPermission,
    requestPermission,
    configureAudioMode,
    onRecordingStatusUpdate,
    durationRef,
    resetRefs,
    recordingRef,
    onError,
  } = deps;

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      let permission = hasPermission;
      if (permission === null) {
        permission = await requestPermission();
      }

      if (!permission) {
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
        isApproachingMaxDuration: false,
        meteringLevel: 0,
        recordingUri: null,
        secondsUntilMaxDuration: null,
        state: 'preparing',
      }));

      resetRefs();
      await configureAudioMode();

      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS,
        onRecordingStatusUpdate,
        STATUS_UPDATE_INTERVAL_MS
      );

      (recordingRef as { current: Audio.Recording | null }).current = recording;
      (durationRef as { current: number }).current = 0;

      setStatus((prev) => ({ ...prev, state: 'recording' }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start recording';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    hasPermission,
    requestPermission,
    configureAudioMode,
    onRecordingStatusUpdate,
    onError,
    setStatus,
    durationRef,
    resetRefs,
    recordingRef,
  ]);

  return { startRecording };
}
