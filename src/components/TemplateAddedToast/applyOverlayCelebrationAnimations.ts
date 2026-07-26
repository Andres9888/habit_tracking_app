import type { RefObject } from 'react';
import type ConfettiCannon from 'react-native-confetti-cannon';
import {
  Easing,
  type SharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { triggerHaptic } from '@/utils/haptics';
import { SPRING_BOUNCY, SPRING_EXIT, SPRING_ICON } from './constants';

interface OverlayAnimationValues {
  actionsOpacity: SharedValue<number>;
  actionsY: SharedValue<number>;
  badgeScale: SharedValue<number>;
  emojiScale: SharedValue<number>;
  glowOpacity: SharedValue<number>;
  overlayOpacity: SharedValue<number>;
  subtitleOpacity: SharedValue<number>;
  subtitleY: SharedValue<number>;
  titleOpacity: SharedValue<number>;
  titleY: SharedValue<number>;
}

export function applyOverlayCelebrationAnimations(
  values: OverlayAnimationValues,
  confettiRef: RefObject<ConfettiCannon | null>,
  visible: boolean,
  reducedMotion: boolean
): void {
  if (!visible) {
    values.overlayOpacity.value = 0;
    values.emojiScale.value = 0;
    values.badgeScale.value = 0;
    values.titleOpacity.value = 0;
    values.subtitleOpacity.value = 0;
    values.actionsOpacity.value = 0;
    values.glowOpacity.value = 0;
    return;
  }
  if (reducedMotion) {
    values.overlayOpacity.value = 1;
    values.emojiScale.value = 1;
    values.badgeScale.value = 1;
    values.titleOpacity.value = 1;
    values.titleY.value = 0;
    values.subtitleOpacity.value = 1;
    values.subtitleY.value = 0;
    values.actionsOpacity.value = 1;
    values.actionsY.value = 0;
    values.glowOpacity.value = 0.15;
    return;
  }

  triggerHaptic('success');
  confettiRef.current?.start();
  values.overlayOpacity.value = withTiming(1, {
    duration: 400,
    easing: Easing.out(Easing.ease),
  });
  values.emojiScale.value = withDelay(
    300,
    withSequence(
      withSpring(1.1, SPRING_ICON),
      withSpring(1, SPRING_EXIT)
    )
  );
  values.badgeScale.value = withDelay(
    700,
    withSpring(1, springs.celebration)
  );
  values.glowOpacity.value = withDelay(
    200,
    withSequence(
      withTiming(0.3, { duration: 400 }),
      withTiming(0.12, { duration: 600 })
    )
  );
  values.titleOpacity.value = withDelay(
    500,
    withTiming(1, { duration: 350 })
  );
  values.titleY.value = withDelay(500, withSpring(0, SPRING_BOUNCY));
  values.subtitleOpacity.value = withDelay(
    650,
    withTiming(1, { duration: 350 })
  );
  values.subtitleY.value = withDelay(650, withSpring(0, SPRING_BOUNCY));
  values.actionsOpacity.value = withDelay(
    850,
    withTiming(1, { duration: 350 })
  );
  values.actionsY.value = withDelay(850, withSpring(0, SPRING_BOUNCY));
}
