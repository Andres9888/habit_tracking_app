/**
 * useAudioMode - Audio mode configuration for playback
 *
 * Configures the audio session for playback with proper interruption handling.
 */

import { useCallback } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

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
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      // Native Handset: Do not mix with other audio - pause when interrupted
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      // iOS: Do not mix with other audio - pause when interrupted
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      // Native Handset-specific
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: false,
      // Don't duck, pause completely
      staysActiveInBackground: false,
    });
  }, []);

  return { configureAudioMode };
}
