/**
 * Confetti management hook for MilestoneCelebration
 */

import { useEffect, useRef } from 'react';
import { ANIMATION_TIMING } from './constants';

interface UseConfettiProps {
  visible: boolean;
  reduceMotion: boolean;
}

export function useConfetti({ visible, reduceMotion }: UseConfettiProps) {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (visible && confettiRef.current && !reduceMotion) {
      setTimeout(() => {
        confettiRef.current?.start();
      }, ANIMATION_TIMING.CONFETTI_DELAY);
    }
  }, [visible, reduceMotion]);

  return confettiRef;
}
