/**
 * Hook for pause/resume control during recording
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useCallback, RefObject } from 'react';
import { Audio } from 'expo-av';
import type { RecordingStatus, RecordingState } from './types';

type SetStatus = React.Dispatch<React.SetStateAction<RecordingStatus>>;

interface UseRecordingControlDeps {
  setStatus: SetStatus;
  currentState: RecordingState;
  configureAudioMode: () => Promise<void>;
  recordingRef: RefObject<Audio.Recording | null>;
  wasRecordingBeforeInterruptionRef: RefObject<boolean>;
  onInterruptionEnded?: () => void;
  onError?: (error: Error) => void;
}

export function useRecordingControl(deps: UseRecordingControlDeps) {
  const {
    setStatus,
    currentState,
    configureAudioMode,
    recordingRef,
    wasRecordingBeforeInterruptionRef,
    onInterruptionEnded,
    onError,
  } = deps;

  const pauseRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current || currentState !== 'recording') return;

    try {
      await recordingRef.current.pauseAsync();
      setStatus((prev) => ({ ...prev, state: 'paused' }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to pause recording';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [currentState, onError, setStatus, recordingRef]);

  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!recordingRef.current || currentState !== 'paused') return;

    try {
      await recordingRef.current.startAsync();
      setStatus((prev) => ({ ...prev, state: 'recording' }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to resume recording';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [currentState, onError, setStatus, recordingRef]);

  const resumeFromInterruption = useCallback(async (): Promise<void> => {
    if (!recordingRef.current || currentState !== 'interrupted') return;

    try {
      await configureAudioMode();
      await recordingRef.current.startAsync();

      (wasRecordingBeforeInterruptionRef as { current: boolean }).current =
        false;

      setStatus((prev) => ({
        ...prev,
        interruptionReason: null,
        state: 'recording',
      }));

      onInterruptionEnded?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resume after interruption';
      setStatus((prev) => ({ ...prev, errorMessage, state: 'error' }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    currentState,
    configureAudioMode,
    onInterruptionEnded,
    onError,
    setStatus,
    recordingRef,
    wasRecordingBeforeInterruptionRef,
  ]);

  return { pauseRecording, resumeFromInterruption, resumeRecording };
}
