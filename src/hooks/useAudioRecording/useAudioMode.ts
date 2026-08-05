/**
 * Hook for configuring audio mode for recording
 *
 * Story T10.2: Audio recording integration (expo-av)
 */

import { useCallback } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

/**
 * Hook that provides audio mode configuration for recording
 * Handles interruption settings so recording pauses during phone calls or other app audio
 */
export function useAudioMode() {
  /**
   * Configure audio mode for recording
   * Sets up interruption handling so recording pauses during phone calls or other app audio
   */
  const configureAudioMode = useCallback(async (): Promise<void> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,

      // Native Handset: Do not mix with other audio - pause when interrupted
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,

      // iOS: Do not mix with other audio - pause when interrupted
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,

      playsInSilentModeIOS: true,

      // Native Handset-specific
      playThroughEarpieceAndroid: false,

      shouldDuckAndroid: false,

      // Don't duck, pause completely for recording
      staysActiveInBackground: false,
    });
  }, []);

  /**
   * Reset audio mode after recording is complete
   */
  const resetAudioMode = useCallback(async (): Promise<void> => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  }, []);

  return { configureAudioMode, resetAudioMode };
}
