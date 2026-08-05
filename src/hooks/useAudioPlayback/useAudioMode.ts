/**
 * useAudioMode - Audio mode configuration for playback
 *
 * Configures the audio session for playback with proper interruption handling.
 */

import { useCallback } from 'react';
import { setAudioModeAsync } from 'expo-audio';

export interface UseAudioModeReturn {
  configureAudioMode: () => Promise<void>;
}

/**
 * Hook for configuring audio mode
 *
 * Sets up interruption handling so playback pauses during phone calls or other app audio.
 */
export function useAudioMode(): UseAudioModeReturn {
  const configureAudioMode = useCallback(async (): Promise<void> => {
    await setAudioModeAsync({
      allowsRecording: false,
      interruptionMode: 'doNotMix',
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  return { configureAudioMode };
}
