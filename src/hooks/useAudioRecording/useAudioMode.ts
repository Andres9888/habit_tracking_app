/**
 * Hook for configuring audio mode for recording
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { useCallback } from 'react';
import { setAudioModeAsync } from 'expo-audio';

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
    await setAudioModeAsync({
      allowsRecording: true,
      interruptionMode: 'doNotMix',
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  /**
   * Reset audio mode after recording is complete
   */
  const resetAudioMode = useCallback(async (): Promise<void> => {
    await setAudioModeAsync({
      allowsRecording: false,
    });
  }, []);

  return { configureAudioMode, resetAudioMode };
}
