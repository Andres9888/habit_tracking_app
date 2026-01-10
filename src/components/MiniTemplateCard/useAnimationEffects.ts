/**
 * Animation effects for MiniTemplateCard component
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  cancelAnimation,
  Easing,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useScienceBadgePulse(
  scienceBadgePulse: SharedValue<number>,
  reducedMotion: boolean,
  hasResearch: boolean | undefined,
  isImported: boolean | undefined
) {
  useEffect(() => {
    if (reducedMotion || !hasResearch || isImported) {
      cancelAnimation(scienceBadgePulse);
      scienceBadgePulse.value = 1;
      return;
    }

    scienceBadgePulse.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(scienceBadgePulse);
    };
  }, [scienceBadgePulse, reducedMotion, hasResearch, isImported]);
}

export function useButtonPulse(
  buttonPulse: SharedValue<number>,
  reducedMotion: boolean,
  isImporting: boolean | undefined,
  isImported: boolean | undefined,
  hasImportHandler: boolean
) {
  useEffect(() => {
    if (reducedMotion || isImporting || isImported || !hasImportHandler) return;

    buttonPulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(buttonPulse);
    };
  }, [buttonPulse, reducedMotion, isImporting, isImported, hasImportHandler]);
}

export function useSuccessAnimation(
  isImported: boolean | undefined,
  checkmarkScale: SharedValue<number>,
  successGlow: SharedValue<number>,
  buttonPulse: SharedValue<number>
) {
  useEffect(() => {
    if (isImported) {
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      successGlow.value = withSequence(
        withTiming(0.6, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
      cancelAnimation(buttonPulse);
      buttonPulse.value = 1;
    } else {
      checkmarkScale.value = 0;
      successGlow.value = 0;
    }
  }, [isImported, checkmarkScale, successGlow, buttonPulse]);
}
