/**
 * useCompletionSound - Hook for playing completion sounds
 *
 * Premium feature: Short satisfying sound effects when completing a habit.
 * Uses expo-av for playback with bundled sound assets.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import type { CompletionSoundType } from '../../convex/settings/types';

// Sound file mappings - requires bundling with Metro
const SOUND_ASSETS: Record<CompletionSoundType, number> = {
  chime: require('../../assets/sounds/chime.wav'),
  pop: require('../../assets/sounds/pop.wav'),
  success: require('../../assets/sounds/success.wav'),
};

interface UseCompletionSoundOptions {
  soundEnabled?: boolean;
  soundType?: CompletionSoundType;
}

/**
 * Hook for playing completion sounds when marking habits as complete.
 * Premium feature providing satisfying audio feedback.
 *
 * @param options - Configuration options
 * @param options.soundEnabled - Whether sound playback is enabled (default: false)
 * @param options.soundType - Which sound to play: 'chime', 'pop', or 'success' (default: 'chime')
 * @returns Object containing the playCompletionSound function
 *
 * @example
 * ```ts
 * const { playCompletionSound } = useCompletionSound({ soundEnabled: true });
 * await playCompletionSound();
 * ```
 */
export function useCompletionSound({
  soundEnabled = false,
  soundType = 'chime',
}: UseCompletionSoundOptions = {}) {
  // Use undefined instead of null to avoid type union issues

  const soundRef = useRef<Audio.Sound | undefined>(undefined);
  const loadingRef = useRef(false);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      soundRef.current = undefined;
    };
  }, []);

  const playCompletionSound = useCallback(async () => {
    if (!soundEnabled || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    try {
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
      sound.setOnPlaybackStatusUpdate(
        (status: { isLoaded: boolean; didJustFinish?: boolean }) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            soundRef.current = undefined;
          }
        }
      );
    } catch (error) {
      // Silently fail - sounds are non-critical UX enhancements
      if (__DEV__) console.warn('Failed to play completion sound:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [soundEnabled, soundType]);

  return {
    playCompletionSound,
  };
}

export default useCompletionSound;
