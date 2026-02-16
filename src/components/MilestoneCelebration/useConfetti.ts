/**
 * Confetti management hook for MilestoneCelebration
 */

import { useEffect, useRef } from 'react';
import type ConfettiCannon from 'react-native-confetti-cannon';
import { ANIMATION_TIMING } from './constants';

interface UseConfettiProps {
  visible: boolean;
  reduceMotion: boolean;
  /** Called when confetti starts — use for sound effects */
  onStart?: () => void;
}

export function useConfetti({ visible, reduceMotion, onStart }: UseConfettiProps) {
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    if (visible && confettiRef.current && !reduceMotion) {
      setTimeout(() => {
        confettiRef.current?.start();
        onStart?.();
      }, ANIMATION_TIMING.CONFETTI_DELAY);
    }
  }, [visible, reduceMotion, onStart]);

  return confettiRef;
}
