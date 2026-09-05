/**
 * Shared success feedback + press feedback for template add buttons: when a
 * habit flips to imported, fire the success haptic and a quick spring
 * bounce; on press in/out, apply the standard card press scale. Bounce is
 * guarded so it only runs on the false→true transition — list
 * virtualization remounts rows during scroll, and an unguarded effect would
 * buzz and bounce for every already-imported card scrolled back into view.
 */

import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '../../../../theme/animations';
import { pressCard, releaseCard } from '@/utils/animations/cardPressAnimation';
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
    scale.value = withSpring(1.1, springs.standard);
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, springs.standard);
    }, 120);
    return () => clearTimeout(timeout);
  }, [isImported, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    onPressIn: () => pressCard(scale),
    onPressOut: () => releaseCard(scale),
  };
}
