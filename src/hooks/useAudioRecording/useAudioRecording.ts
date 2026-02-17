/**
 * useAudioRecording Hook - Main orchestrator
 * Audio recording integration using expo-av for Voice Notes feature.
 */

import { useEffect } from 'react';
import type {
  UseAudioRecordingOptions,
  UseAudioRecordingReturn,
} from './types';
import { useRecordingHooks } from './useRecordingHooks';
import { useAppStateInterruption } from './useAppStateInterruption';
import { buildReturnValue } from './buildReturnValue';

/**
 * Hook for audio recording with full control over recording lifecycle.
 * Orchestrates expo-av Audio.Recording with permissions and app state management.
 *
 * @description
 * Provides comprehensive audio recording features:
 * - Request and check microphone permissions
 * - Start/pause/resume/stop recording
 * - Cancel recording without saving
 * - Automatic stop on app background
 * - Resume after interruptions (phone calls, Siri, etc.)
 * - Configurable max duration with auto-stop
 * - Configurable quality settings (bitrate, sample rate)
 *
 * Recording flow:
 * 1. Check/request permissions
 * 2. Start recording
 * 3. Optional pause/resume during recording
 * 4. Stop to get file URI, or cancel to discard
 *
 * @param options - Configuration options
 * @param options.maxDurationMs - Maximum recording duration in milliseconds
 * @param options.onMaxDuration - Callback when max duration is reached
 * @param options.onRecordingComplete - Callback when recording stops with URI
 * @param options.onInterruptionEnded - Callback when interruption ends
 * @param options.quality - Recording quality preset ('low' | 'medium' | 'high')
 * @returns Object with recording controls and status
 *
 * @example
 * ```tsx
 * function VoiceNoteRecorder() {
 *   const {
 *     startRecording,
 *     stopRecording,
 *     pauseRecording,
 *     resumeRecording,
 *     status,
 *     requestPermission
 *   } = useAudioRecording({
 *     maxDurationMs: 300000, // 5 minutes
 *     onMaxDuration: () => toast.info('Max duration reached'),
 *     onRecordingComplete: (uri) => saveAudio(uri)
 *   });
 *
 *   const handleStart = async () => {
 *     const granted = await requestPermission();
 *     if (granted) {
 *       await startRecording();
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Button onPress={handleStart}>Start Recording</Button>
 *       {status.state === 'recording' && (
 *         <>
 *           <Text>{status.durationFormatted}</Text>
 *           <Button onPress={pauseRecording}>Pause</Button>
 *           <Button onPress={stopRecording}>Stop</Button>
 *         </>
 *       )}
 *     </View>
 *   );
 * }
 * ```
 */
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
