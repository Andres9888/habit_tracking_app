/**
 * Animation hook for full-screen celebration overlay
 * Glow ring, emoji pop, check badge, staggered text fade-in
 */

import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

import { durations, springs } from '@/theme/animations';
import {
  SPRING_BOUNCY,
  SPRING_CELEBRATION_SETTLE,
  SPRING_ICON,
} from './constants';
import { triggerHaptic } from '@/utils/haptics';

interface Params {
  visible: boolean;
  reducedMotion: boolean;
}

export function useCelebrationAnimations({ visible, reducedMotion }: Params) {
  const confettiRef = useRef<ConfettiCannon>(null);
  const overlayOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(16);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(16);
  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(16);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      overlayOpacity.value = 0;
      emojiScale.value = 0;
      badgeScale.value = 0;
      titleOpacity.value = 0;
      subtitleOpacity.value = 0;
      actionsOpacity.value = 0;
      glowOpacity.value = 0;
      return;
    }
    if (reducedMotion) {
      overlayOpacity.value = 1;
      emojiScale.value = 1;
      badgeScale.value = 1;
      titleOpacity.value = 1;
      titleY.value = 0;
      subtitleOpacity.value = 1;
      subtitleY.value = 0;
      actionsOpacity.value = 1;
      actionsY.value = 0;
      glowOpacity.value = 0.15;
      return;
    }
    triggerHaptic('success');
    if (confettiRef.current) confettiRef.current.start();

    overlayOpacity.value = withTiming(1, {
      duration: durations.emphasis,
      easing: Easing.out(Easing.ease),
    });
    emojiScale.value = withDelay(
      durations.moderate,
      withSequence(
        withSpring(1.1, SPRING_ICON),
        withSpring(1, SPRING_CELEBRATION_SETTLE)
      )
    );
    badgeScale.value = withDelay(
      durations.complex + durations.instant,
      withSpring(1, springs.celebration)
    );
    glowOpacity.value = withDelay(
      durations.standard,
      withSequence(
        withTiming(0.3, { duration: durations.emphasis }),
        withTiming(0.12, { duration: durations.complex })
      )
    );
    titleOpacity.value = withDelay(
      durations.complex,
      withTiming(1, { duration: durations.sheet })
    );
    titleY.value = withDelay(durations.complex, withSpring(0, SPRING_BOUNCY));
    subtitleOpacity.value = withDelay(
      durations.complex + durations.quick,
      withTiming(1, { duration: durations.sheet })
    );
    subtitleY.value = withDelay(
      durations.complex + durations.quick,
      withSpring(0, SPRING_BOUNCY)
    );
    actionsOpacity.value = withDelay(
      durations.complex + durations.sheet,
      withTiming(1, { duration: durations.sheet })
    );
    actionsY.value = withDelay(
      durations.complex + durations.sheet,
      withSpring(0, SPRING_BOUNCY)
    );
  }, [visible, reducedMotion]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));
  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsY.value }],
  }));

  return {
    actionsStyle,
    badgeStyle,
    confettiRef,
    emojiStyle,
    glowStyle,
    overlayStyle,
    subtitleStyle,
    titleStyle,
  };
}
