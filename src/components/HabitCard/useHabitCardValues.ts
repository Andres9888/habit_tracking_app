/**
 * useHabitCardValues Hook
 *
 * Manages shared animation values for HabitCard.
 */

import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { safeParseNumber } from '../../utils/validation';

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
  showCompletionToast: boolean;
  setShowCompletionToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useHabitCardValues(strength: number): HabitCardValues {
  // Validate and clamp strength to 0-100 range
  const safeStrength = safeParseNumber(strength, 0, 0, 100);

  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const strengthFillWidth = useSharedValue(safeStrength);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [xpPosition, setXPPosition] = useState({ x: 0, y: 0 });
  const [isToggling, setIsToggling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  return {
    cardScale,
    isToggling,
    setIsToggling,
    setShowCompletionToast,
    setShowConfetti,
    setShowFloatingXP,
    setXPPosition,
    showCompletionToast,
    showConfetti,
    showFloatingXP,
    strengthFillWidth,
    translateX,
    xpPosition,
  };
}
