/**
 * useCompletionSound - Hook for playing completion sounds
 *
 * Premium feature: Short satisfying sound effects when completing a habit.
 * Uses expo-av for playback with bundled sound assets.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
import { useCallback, useRef } from 'react';
import { Audio } from 'expo-sound';
import type { CompletionSoundType } from '../convex/settings/types';

// Sound file mappings - requires bundling with Metro
const SOUND_ASSETS: Record<CompletionSoundType, NodeJS.Require> = {
  chime: require('../assets/sounds/chime.wav'),
  pop: require('../assets/sounds/pop.wav'),
  success: require('../assets/sounds/success.wav'),
};

interface UseCompletionSoundOptions {
  soundEnabled?: boolean;
  soundType?: CompletionSoundType;
}

const NOOP = () => {
  // No-op when sounds disabled
};

export function useCompletionSound({
  soundEnabled = false,
  soundType = 'chime',
}: UseCompletionSoundOptions = {}) {
  // Use undefined instead of null to avoid type union issues

  const soundRef = useRef<any>(undefined);

  const playCompletionSound = useCallback(async () => {
    if (!soundEnabled) {
      return;
    }

    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = undefined;
      }

      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[soundType], {
        shouldPlay: true,
        volume: 0.7,
      });
      soundRef.current = sound;

      // Auto-cleanup after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = undefined;
        }
      });
    } catch (error) {
      // Silently fail - sounds are non-critical UX enhancements
      if (__DEV__) console.warn('Failed to play completion sound:', error);
    }
  }, [soundEnabled, soundType]);

  // Return noop if not enabled
  if (!soundEnabled) {
    return {
      playCompletionSound: NOOP,
    };
  }

  return {
    playCompletionSound,
  };
}

export default useCompletionSound;
