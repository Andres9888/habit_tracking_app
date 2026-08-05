/**
 * useCompletionSound - Hook for playing completion sounds
 *
 * Premium feature: Short satisfying sound effects when completing a habit.
 * Uses expo-audio for playback with bundled sound assets.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
import { useCallback, useEffect, useRef } from 'react';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
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

  // One player is created per sound type and reused for every subsequent play.
  // Building a fresh AudioPlayer on each completion put asset decoding on the
  // tap's critical path.
  const soundRef = useRef<AudioPlayer | undefined>(undefined);
  const loadedTypeRef = useRef<CompletionSoundType | undefined>(undefined);

  useEffect(() => {
    return () => {
      soundRef.current?.remove();
      soundRef.current = undefined;
      loadedTypeRef.current = undefined;
    };
  }, []);

  const playCompletionSound = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    try {
      if (!soundRef.current || loadedTypeRef.current !== soundType) {
        soundRef.current?.remove();
        const sound = createAudioPlayer(SOUND_ASSETS[soundType], {
          keepAudioSessionActive: true,
        });
        sound.volume = 0.7;
        soundRef.current = sound;
        loadedTypeRef.current = soundType;
      }

      // Rewind so rapid consecutive completions each retrigger the sound.
      // Not awaited: playback should start on this tick, not a microtask later.
      void soundRef.current.seekTo(0)?.catch(() => {});
      soundRef.current.play();
    } catch (error) {
      // Silently fail - sounds are non-critical UX enhancements
      if (__DEV__) console.warn('Failed to play completion sound:', error);
    }
  }, [soundEnabled, soundType]);

  return {
    playCompletionSound,
  };
}

export default useCompletionSound;
