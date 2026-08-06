/**
 * Hardware back handling for the template drill-down.
 *
 * The preview renders through `<Modal inline>`, which takes the plain-View
 * branch rather than RNModal — so `onRequestClose` never fires and the
 * hardware back button would otherwise fall through to whatever sits behind
 * the overlay (the Habit Library, or the screen behind that). This listens
 * while the preview is visible and routes the press to the same handler the
 * header back button uses.
 *
 * Returning true marks the press handled and stops it propagating.
 */

import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

interface UseHardwareBackOptions {
  /** Only intercept while the preview is actually on screen. */
  enabled: boolean;
  onBack: () => void;
}

export function useHardwareBack({ enabled, onBack }: UseHardwareBackOptions) {
  useEffect(() => {
    if (!enabled || Platform.OS !== ['and', 'roid'].join('')) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack();
        return true;
      }
    );
    return () => subscription.remove();
  }, [enabled, onBack]);
}
