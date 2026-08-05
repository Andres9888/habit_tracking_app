/**
 * Sound preview hook for SoundPicker
 */

import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { triggerHaptic } from '@/utils/haptics';
import type { CompletionSoundType } from '../../../convex/settings/types';

/* eslint-disable @typescript-eslint/no-require-imports */
const SOUND_ASSETS: Record<CompletionSoundType, number> = {
  chime: require('../../../assets/sounds/chime.wav'),
  pop: require('../../../assets/sounds/pop.wav'),
  success: require('../../../assets/sounds/success.wav'),
};

export function useSoundPreview(onSelect: (type: CompletionSoundType) => void) {
  const soundRef = useRef<Audio.Sound | undefined>(undefined);

  const preview = useCallback(async (type: CompletionSoundType) => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[type], {
        shouldPlay: true,
        volume: 0.7,
      });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate(
        (s: { isLoaded: boolean; didJustFinish?: boolean }) => {
          if (s.isLoaded && s.didJustFinish) {
            sound.unloadAsync();
            soundRef.current = undefined;
          }
        }
      );
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
