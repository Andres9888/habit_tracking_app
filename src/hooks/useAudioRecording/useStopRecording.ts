/**
 * Hook for stopping and canceling recordings
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { useCallback, RefObject } from 'react';
import type { AudioRecorder } from 'expo-audio';
import type { RecordingStatus } from './types';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseStopRecordingDeps {
  setStatus: SetStatus;
  resetAudioMode: () => Promise<void>;
  durationRef: RefObject<number>;
  resetRefs: () => void;
  recordingRef: RefObject<AudioRecorder | null>;
  onRecordingComplete?: (uri: string, durationSeconds: number) => void;
  onError?: (error: Error) => void;
}

export function useStopRecording(deps: UseStopRecordingDeps) {
  const {
    setStatus,
    resetAudioMode,
    durationRef,
    resetRefs,
    recordingRef,
    onRecordingComplete,
    onError,
  } = deps;

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recordingRef.current) return null;

    try {
      setStatus((prev) => ({ ...prev, state: 'stopping' }));

      await recordingRef.current.stop();
      await resetAudioMode();

      const uri = recordingRef.current.uri;
      const finalDuration = durationRef.current ?? 0;

      (recordingRef as { current: AudioRecorder | null }).current = null;

      setStatus((prev) => ({ ...prev, recordingUri: uri, state: 'stopped' }));

      if (uri) {
        onRecordingComplete?.(uri, finalDuration);
      }

      return uri;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to stop recording';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, [
    onRecordingComplete,
    onError,
    setStatus,
    durationRef,
    resetAudioMode,
    recordingRef,
  ]);

  const cancelRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current) return;

    try {
      try {
        await recordingRef.current.stop();
      } catch {
        // Recording might already be stopped
      }

      await resetAudioMode();

      (recordingRef as { current: AudioRecorder | null }).current = null;
      resetRefs();

      setStatus((prev) => ({
        ...prev,
        durationSeconds: 0,
        errorMessage: null,
        interruptionReason: null,
        isApproachingMaxDuration: false,
        meteringLevel: 0,
        recordingUri: null,
        secondsUntilMaxDuration: null,
        state: 'idle',
        wasInterrupted: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel recording';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [onError, setStatus, resetRefs, resetAudioMode, recordingRef]);

  return { cancelRecording, stopRecording };
}
