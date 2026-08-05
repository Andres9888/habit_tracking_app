/**
 * Hook for stopping and canceling recordings
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useCallback, RefObject } from 'react';
import { Audio } from 'expo-av';
import type { RecordingStatus } from './types';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseStopRecordingDeps {
  setStatus: SetStatus;
  resetAudioMode: () => Promise<void>;
  durationRef: RefObject<number>;
  resetRefs: () => void;
  recordingRef: RefObject<Audio.Recording | null>;
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

      await recordingRef.current.stopAndUnloadAsync();
      await resetAudioMode();

      const uri = recordingRef.current.getURI();
      const finalDuration = durationRef.current ?? 0;

      (recordingRef as { current: Audio.Recording | null }).current = null;

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
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // Recording might already be stopped
      }

      await resetAudioMode();

      (recordingRef as { current: Audio.Recording | null }).current = null;
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
