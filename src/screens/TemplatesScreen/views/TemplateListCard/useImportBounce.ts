/**
 * Shared success feedback for template add buttons: when a habit flips to
 * imported, fire the success haptic and a quick spring bounce. Guarded so the
 * effect only runs on the false→true transition — list virtualization
 * remounts rows during scroll, and an unguarded effect would buzz and bounce
 * for every already-imported card scrolled back into view.
 */

import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '../../../../theme/animations';
import { triggerHaptic } from '@/utils/haptics';

export function useImportBounce(isImported: boolean) {
  const scale = useSharedValue(1);
  const prevImported = useRef<boolean | null>(null);

  useEffect(() => {
    const prev = prevImported.current;
    prevImported.current = isImported;
    // Skip mount (prev === null) and any non-transition re-run.
    if (prev === null || prev || !isImported) return;
    void triggerHaptic('success');
    scale.value = withSpring(1.1, springs.responsive);
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, springs.responsive);
    }, 120);
    return () => clearTimeout(timeout);
  }, [isImported, scale]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
}
