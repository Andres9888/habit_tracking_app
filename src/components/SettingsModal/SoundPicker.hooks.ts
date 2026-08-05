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
  const soundRef = useRef<AudioPlayer | undefined>(undefined);

  const preview = useCallback(async (type: CompletionSoundType) => {
    try {
      if (soundRef.current) soundRef.current.remove();
      const sound = createAudioPlayer(SOUND_ASSETS[type], {
        keepAudioSessionActive: true,
      });
      sound.volume = 0.7;
      soundRef.current = sound;
      sound.addListener('playbackStatusUpdate', (status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.remove();
          if (soundRef.current === sound) {
            soundRef.current = undefined;
          }
        }
      });
      sound.play();
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
