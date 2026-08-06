/**
 * Hook for starting a new recording
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { useCallback, RefObject } from 'react';
import type { AudioRecorder } from 'expo-audio';
import type { RecordingStatus } from './types';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseStartRecordingDeps {
  setStatus: SetStatus;
  hasPermission: boolean | null;
  requestPermission: () => Promise<boolean>;
  configureAudioMode: () => Promise<void>;
  durationRef: RefObject<number>;
  resetRefs: () => void;
  recorder: AudioRecorder;
  recordingRef: RefObject<AudioRecorder | null>;
  onError?: (error: Error) => void;
}

export function useStartRecording(deps: UseStartRecordingDeps) {
  const {
    setStatus,
    hasPermission,
    requestPermission,
    configureAudioMode,
    durationRef,
    resetRefs,
    recorder,
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

      await recorder.prepareToRecordAsync();
      recorder.record();

      (recordingRef as { current: AudioRecorder | null }).current = recorder;
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
    onError,
    recorder,
    setStatus,
    durationRef,
    resetRefs,
    recordingRef,
  ]);

  return { startRecording };
}
