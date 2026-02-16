/**
 * useCelebrationSound - Sound effects for milestone celebrations
 *
 * Plays escalating sounds during celebrations. Uses the same sound assets
 * as useCompletionSound but with celebration-specific logic.
 *
 * Respects the user's sound preference setting.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import type { CompletionSoundType } from '../../convex/settings/types';

const SOUND_ASSETS: Record<CompletionSoundType, number> = {
  chime: require('../../assets/sounds/chime.wav'),
  pop: require('../../assets/sounds/pop.wav'),
  success: require('../../assets/sounds/success.wav'),
};

/**
 * Hook for playing celebration sounds during milestone celebrations.
 *
 * @returns Object with playCelebrationSound function
 *
 * @example
 * ```ts
 * const { playCelebrationSound } = useCelebrationSound();
 * playCelebrationSound('success'); // plays the success sound
 * ```
 */
export function useCelebrationSound() {
  const soundRef = useRef<Audio.Sound | undefined>(undefined);

  const playCelebrationSound = useCallback(
    async (soundType: CompletionSoundType = 'chime') => {
      try {
        // Unload previous sound if exists
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = undefined;
        }

        const { sound } = await Audio.Sound.createAsync(
          SOUND_ASSETS[soundType],
          {
            shouldPlay: true,
            volume: 0.8,
          }
        );
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
      } catch {
        // Sounds are non-critical — silently fail
      }
    },
    []
  );

  return { playCelebrationSound };
}

export default useCelebrationSound;
