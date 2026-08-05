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
  const playerRef = useRef<AudioPlayer | undefined>(undefined);

  useEffect(() => {
    return () => {
      playerRef.current?.remove();
      playerRef.current = undefined;
    };
  }, []);

  const playCompletionSound = useCallback(async () => {
    if (!soundEnabled) {
      return;
    }

    try {
      playerRef.current?.remove();

      const player = createAudioPlayer(SOUND_ASSETS[soundType]);
      playerRef.current = player;
      player.volume = 0.7;
      player.play();

      // Auto-cleanup after playback
      player.addListener('playbackStatusUpdate', status => {
        if (status.didJustFinish) {
          player.remove();
          if (playerRef.current === player) playerRef.current = undefined;
        }
      });
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
