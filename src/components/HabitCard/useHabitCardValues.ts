/**
 * useHabitCardValues Hook
 *
 * Manages shared animation values for HabitCard.
 */

import { type MutableRefObject, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export interface HabitCardValues {
  translateX: ReturnType<typeof useSharedValue<number>>;
  cardScale: ReturnType<typeof useSharedValue<number>>;
  strengthFillWidth: ReturnType<typeof useSharedValue<number>>;
  showFloatingXP: boolean;
  setShowFloatingXP: React.Dispatch<React.SetStateAction<boolean>>;
  xpPosition: { x: number; y: number };
  setXPPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isToggling: boolean;
  setIsToggling: React.Dispatch<React.SetStateAction<boolean>>;
  showConfetti: boolean;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  isMountedRef: MutableRefObject<boolean>;
}

export function useHabitCardValues(strength: number): HabitCardValues {
  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const strengthFillWidth = useSharedValue(strength);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [xpPosition, setXPPosition] = useState({ x: 0, y: 0 });
  const [isToggling, setIsToggling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    cardScale,
    isMountedRef,
    isToggling,
    setIsToggling,
    setShowConfetti,
    setShowFloatingXP,
    setXPPosition,
    showConfetti,
    showFloatingXP,
    strengthFillWidth,
    translateX,
    xpPosition,
  };
}
