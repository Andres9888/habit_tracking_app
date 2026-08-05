/**
 * Animation hook for full-screen celebration overlay
 * Glow ring, emoji pop, check badge, staggered text fade-in
 */

import { useEffect, useRef } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

import { applyOverlayCelebrationAnimations } from './applyOverlayCelebrationAnimations';

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
    applyOverlayCelebrationAnimations(
      {
        actionsOpacity,
        actionsY,
        badgeScale,
        emojiScale,
        glowOpacity,
        overlayOpacity,
        subtitleOpacity,
        subtitleY,
        titleOpacity,
        titleY,
      },
      confettiRef,
      visible,
      reducedMotion
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
