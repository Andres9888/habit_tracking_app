/**
 * SuccessState - Post-creation celebration screen
 *
 * Features:
 * - Pop animation on the success icon
 * - Confetti particles floating upward
 * - Habit name confirmation
 * - "Add another habit" button to reset
 */

import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CONFETTI_CONFIG, POP_ANIMATION, SPRING_CONFIGS } from './animations';
import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { SuccessStateProps } from './types';

/**
 * Individual confetti particle
 */
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    const startX = (Math.random() - 0.5) * 200;

    translateX.value = startX;
    translateY.value = 50;

    translateY.value = withDelay(
      delay,
      withTiming(-300, { duration: CONFETTI_CONFIG.duration, easing: Easing.out(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + drift, { duration: CONFETTI_CONFIG.duration })
    );
    opacity.value = withDelay(
      delay,
      withTiming(0, { duration: CONFETTI_CONFIG.duration, easing: Easing.in(Easing.ease) })
    );
    rotation.value = withDelay(
      delay,
      withTiming(Math.random() * 360, { duration: CONFETTI_CONFIG.duration })
    );
    scale.value = withDelay(
      delay + 200,
      withTiming(0.5, { duration: CONFETTI_CONFIG.duration - 200 })
    );
  }, [delay, opacity, rotation, scale, translateX, translateY]);

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
      ]}
    />
  );
}

/**
 * Confetti burst component
 */
function Confetti() {
  const particles = Array.from({ length: CONFETTI_CONFIG.particleCount }, (_, i) => ({
    id: i,
    delay: Math.random() * 300,
    color: CONFETTI_CONFIG.colors[i % CONFETTI_CONFIG.colors.length],
  }));

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          delay={particle.delay}
          color={particle.color}
        />
      ))}
    </View>
  );
}

/**
 * Success celebration screen after habit creation
 */
export function SuccessState({ habitName, onAddAnother }: SuccessStateProps) {
  const iconScale = useSharedValue(POP_ANIMATION.initialScale);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    // Icon pop animation: 0.8 → 1.1 → 1.0 with bounce
    iconScale.value = withSequence(
      withTiming(POP_ANIMATION.overshootScale, { duration: POP_ANIMATION.duration * 0.6 }),
      withSpring(POP_ANIMATION.finalScale, SPRING_CONFIGS.successPop)
    );

    // Content fade in with delay
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    contentTranslateY.value = withDelay(
      200,
      withSpring(0, SPRING_CONFIGS.entrance)
    );
  }, [contentOpacity, contentTranslateY, iconScale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <Confetti />

      {/* Success Icon */}
      <Animated.View
        style={[
          iconStyle,
          {
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: COLORS.successBackground,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          },
        ]}
      >
        <Text style={{ fontSize: 48 }}>🌿</Text>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[contentStyle, { alignItems: 'center' }]}>
        {/* Headline */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.stone800,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {COPY.successHeadline}
        </Text>

        {/* Subtext */}
        <Text
          style={{
            fontSize: 16,
            color: COLORS.stone400,
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {COPY.successSubtext(habitName)}
        </Text>

        {/* Add another button */}
        <Pressable
          accessibilityLabel={COPY.addAnother}
          accessibilityRole="button"
          accessibilityHint="Creates another habit"
          onPress={onAddAnother}
          style={({ pressed }) => ({
            backgroundColor: COLORS.stone800,
            borderRadius: BORDER_RADIUS.cta,
            height: TOUCH_TARGETS.ctaHeight,
            paddingHorizontal: 32,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {COPY.addAnother}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
