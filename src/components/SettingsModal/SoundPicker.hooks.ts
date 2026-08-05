/**
 * Sound preview hook for SoundPicker
 */

import { useCallback, useRef } from 'react';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { triggerHaptic } from '@/utils/haptics';
import type { CompletionSoundType } from '../../../convex/settings/types';

/* eslint-disable @typescript-eslint/no-require-imports */
const SOUND_ASSETS: Record<CompletionSoundType, number> = {
  chime: require('../../../assets/sounds/chime.wav'),
  pop: require('../../../assets/sounds/pop.wav'),
  success: require('../../../assets/sounds/success.wav'),
};

export function useSoundPreview(onSelect: (type: CompletionSoundType) => void) {
  const playerRef = useRef<AudioPlayer | undefined>(undefined);

  const preview = useCallback(async (type: CompletionSoundType) => {
    try {
      playerRef.current?.remove();
      const player = createAudioPlayer(SOUND_ASSETS[type]);
      playerRef.current = player;
      player.volume = 0.7;
      player.play();
      player.addListener('playbackStatusUpdate', s => {
        if (s.didJustFinish) {
          player.remove();
          if (playerRef.current === player) playerRef.current = undefined;
        }
      });
    } catch {
      // Silent fail — non-critical
    }
  }, []);

  const handleSelect = useCallback(
    (type: CompletionSoundType) => {
      void triggerHaptic('selection');
      void preview(type);
      onSelect(type);
    },
    [onSelect, preview]
  );

  return handleSelect;
}
