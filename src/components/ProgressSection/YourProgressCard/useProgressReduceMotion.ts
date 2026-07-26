import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useProgressReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch((error) => {
        if (__DEV__) {
          console.warn('Error checking reduce motion setting:', error);
        }
        setReduceMotion(false);
      });
  }, []);

  return reduceMotion;
}
