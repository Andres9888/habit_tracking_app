/**
 * Full-screen celebration overlay for first-ever habit import.
 * Glow ring, emoji pop, confetti, staggered text reveal.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

import type { CelebrationOverlayProps } from './CelebrationOverlay.types';
import { celebrationStyles as s } from './CelebrationOverlay.styles';
import { FALLBACK_COLOR } from './constants';
import { useCelebrationAnimations } from './useCelebrationAnimations';
import { colors as palette } from '@/theme/colors';
import { fontWeights } from '@/theme/typography';

export function CelebrationOverlay({
  visible,
  templateData,
  onGoToHabits,
  onAddAnother,
}: CelebrationOverlayProps) {
  const reducedMotion = useReducedMotion();
  const color = templateData?.color ?? FALLBACK_COLOR;
  const anim = useCelebrationAnimations({ reducedMotion, visible });

  if (!visible || !templateData) return null;

  return (
    <Animated.View style={[s.container, anim.overlayStyle]}>
      <LinearGradient
        colors={['#0a0618', '#1a0f30', '#0a0618']}
        style={s.overlay}
      >
        <ConfettiCannon
          ref={anim.confettiRef}
          autoStart={false}
          count={60}
          fadeOut
          fallSpeed={2800}
          origin={{ x: -10, y: 0 }}
        />
        <View>
          <Animated.View
            style={[
              s.glowRing,
              { backgroundColor: `${color}20` },
              anim.glowStyle,
            ]}
          >
            <Animated.Text style={[s.iconEmoji, anim.emojiStyle]}>
              {templateData.icon}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={[s.checkBadge, anim.badgeStyle]}>
            <Text
              style={{
                color: palette.text.inverse,
                fontSize: 16,
                fontWeight: fontWeights.bold,
              }}
            >
              ✓
            </Text>
          </Animated.View>
        </View>
        <Animated.Text style={[s.title, anim.titleStyle]}>
          {templateData.name} Added!
        </Animated.Text>
        <Animated.Text style={[s.subtitle, anim.subtitleStyle]}>
          Your habit is set up. Let&apos;s build a streak!
        </Animated.Text>
        <Animated.View style={[s.actions, anim.actionsStyle]}>
          <Pressable
            accessibilityLabel='Go to my habits'
            accessibilityRole='button'
            style={[s.primaryBtn, { backgroundColor: color }]}
            onPress={onGoToHabits}
          >
            <Text style={s.primaryBtnText}>Go to my habits →</Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Add another habit'
            accessibilityRole='button'
            style={s.actionSecondary}
            onPress={onAddAnother}
          >
            <Text style={s.actionSecondaryText}>Add another habit</Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}
