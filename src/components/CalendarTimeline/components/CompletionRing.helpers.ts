import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors } from '../../../theme/colors';

/** Default size used in the progress header (previously 36) */
export const RING_SIZE = 64;
export const STROKE_WIDTH = 4.5;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const RING_COLORS = {
  track: colors.light.card, // #EDEAE5 — on-system token
  progress: colors.primary[500], // emerald-500
  text: colors.text.primary, // #2D2A26
  completeText: colors.primary[600], // emerald-600
};

export const GLOW_SHADOW = {
  shadowColor: colors.primary[500],
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 6,
};

/** Compute ring geometry from a custom size */
export function getRingGeometry(size: number) {
  const strokeWidth = size >= 56 ? 4.5 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fontSize = size >= 56 ? 14 : 10;
  return { strokeWidth, radius, circumference, fontSize };
}

/** Pulse-scale animation that fires when transitioning to complete */
export function useCelebrationPulse(
  isComplete: boolean,
  reduceMotion: boolean
) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const wasComplete = useRef(false);

  useEffect(() => {
    if (isComplete && !wasComplete.current && !reduceMotion) {
      Animated.sequence([
        Animated.delay(200), // brief pause so the pulse feels "earned"
        Animated.spring(scaleAnim, {
          toValue: 1.35,
          speed: 18,
          bounciness: 12,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasComplete.current = isComplete;
  }, [isComplete, reduceMotion, scaleAnim]);

  return scaleAnim;
}
