/**
 * Confetti management hook for MilestoneCelebration
 */

import { useEffect, useRef } from 'react';
import type ConfettiCannon from 'react-native-confetti-cannon';
import { ANIMATION_TIMING } from './constants';

interface UseConfettiProps {
  visible: boolean;
  reduceMotion: boolean;
}

export function useConfetti({ visible, reduceMotion }: UseConfettiProps) {
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    if (visible && confettiRef.current && !reduceMotion) {
      const timer = setTimeout(() => {
        confettiRef.current?.start();
      }, ANIMATION_TIMING.CONFETTI_DELAY);
      return () => clearTimeout(timer);
    }
  }, [visible, reduceMotion]);

  return confettiRef;
}
