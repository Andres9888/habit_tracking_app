/**
 * useCountAnimation - Hook for animated counting effect
 */

import { useEffect, useState, useRef } from 'react';

const ANIMATION_DURATION = 800;

interface UseCountAnimationOptions {
  animationKey: number | undefined;
  delay: number;
  reduceMotion: boolean;
  targetValue: number;
}

export function useCountAnimation({
  animationKey,
  delay,
  reduceMotion,
  targetValue,
}: UseCountAnimationOptions): number {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animatedForKey = useRef<string | null>(null);

  useEffect(() => {
    const currentKey = `${animationKey}-${targetValue > 0}`;

    if (reduceMotion || animationKey === undefined) {
      setDisplayValue(targetValue);
      return;
    }

    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    if (animatedForKey.current === currentKey) {
      return;
    }

    animatedForKey.current = currentKey;
    setDisplayValue(0);

    const startTime = Date.now() + delay + 50;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now < startTime) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(easedProgress * targetValue);

      setDisplayValue(currentValue);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayValue(targetValue);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [animationKey, targetValue, delay, reduceMotion]);

  return displayValue;
}
