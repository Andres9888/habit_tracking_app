/**
 * useAudioRecording Hook - Main orchestrator
 * Audio recording integration using expo-av for Voice Notes feature.
 */

import { useEffect } from 'react';

import type {
  UseAudioRecordingOptions,
  UseAudioRecordingReturn,
} from './types';
import { buildReturnValue } from './buildReturnValue';
import { useAppStateInterruption } from './useAppStateInterruption';
import { useRecordingHooks } from './useRecordingHooks';

export function useAudioRecording(
  options?: UseAudioRecordingOptions
): UseAudioRecordingReturn {
  const hooks = useRecordingHooks(options);

  useAppStateInterruption({
    currentState: hooks.status.state,
    handleInterruption: hooks.handleInterruption,
    onInterruptionEnded: options?.onInterruptionEnded,
  });

  useEffect(() => {
    return () => {
      hooks.recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, [hooks.recordingRef]);

  return buildReturnValue({
    cancelRecording: hooks.cancelRecording,
    maxDuration: hooks.maxDuration,
    openSettings: hooks.openSettings,
    pauseRecording: hooks.pauseRecording,
    requestPermission: hooks.requestPermission,
    reset: hooks.reset,
    resumeFromInterruption: hooks.resumeFromInterruption,
    resumeRecording: hooks.resumeRecording,
    showPermissionAlert: hooks.showPermissionAlert,
    startRecording: hooks.startRecording,
    status: hooks.status,
    stopRecording: hooks.stopRecording,
  });
}

export default useAudioRecording;
