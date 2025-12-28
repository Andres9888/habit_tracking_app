/**
 * SuccessState - Post-creation celebration screen
 *
 * Features:
 * - Pop animation on the success icon
 * - Confetti particles floating upward
 * - Habit name confirmation
 * - Auto-transition to habit list with shared element animation
 * - Tap anywhere to skip and transition immediately
 * - Haptic feedback on mount
 * - "Add another habit" button to reset (if staying on empty state)
 */

import { useEffect, useCallback, useRef } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import {
  CONFETTI_CONFIG,
  EXIT_TRANSITION,
  EXIT_SPRING_CONFIG,
  PARTICLE_BURST,
  POP_ANIMATION,
  PROGRESS_RING,
  SPRING_CONFIGS,
  TAP_HINT_PULSE,
} from './animations';
import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';
import { ParticleBurst } from './ParticleBurst';
import { ProgressRing } from './ProgressRing';
import type { SuccessStateProps } from './types';

/**
 * Individual confetti particle
 */
function ConfettiParticle({
  delay,
  color,
  shouldReduceMotion,
}: {
  delay: number;
  color: string;
  shouldReduceMotion: boolean;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(shouldReduceMotion ? 0 : 1);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Skip animation if reduced motion is preferred
    if (shouldReduceMotion) {
      opacity.value = 0;
      return;
    }

    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    const startX = (Math.random() - 0.5) * 200;

    translateX.value = startX;
    translateY.value = 50;

    translateY.value = withDelay(
      delay,
      withTiming(-300, {
        duration: CONFETTI_CONFIG.duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + drift, { duration: CONFETTI_CONFIG.duration })
    );
    opacity.value = withDelay(
      delay,
      withTiming(0, {
        duration: CONFETTI_CONFIG.duration,
        easing: Easing.in(Easing.ease),
      })
    );
    rotation.value = withDelay(
      delay,
      withTiming(Math.random() * 360, { duration: CONFETTI_CONFIG.duration })
    );
    scale.value = withDelay(
      delay + 200,
      withTiming(0.5, { duration: CONFETTI_CONFIG.duration - 200 })
    );
  }, [
    delay,
    opacity,
    rotation,
    scale,
    shouldReduceMotion,
    translateX,
    translateY,
  ]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          backgroundColor: color,
          borderRadius: 4,
          height: 8,
          position: 'absolute',
          width: 8,
        },
      ]}
    />
  );
}

/**
 * Confetti burst component
 */
function Confetti({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  // Skip rendering particles entirely when reduced motion is preferred
  if (shouldReduceMotion) return null;

  const particles = Array.from(
    { length: CONFETTI_CONFIG.particleCount },
    (_, i) => ({
      color: CONFETTI_CONFIG.colors[i % CONFETTI_CONFIG.colors.length],
      delay: Math.random() * 300,
      id: i,
    })
  );

  return (
    <View
      pointerEvents='none'
      style={{
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          color={particle.color}
          delay={particle.delay}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </View>
  );
}

/**
 * Success celebration screen after habit creation
 */
export function SuccessState({
  habitName,
  habitEmoji,
  onAddAnother,
  onTransitionComplete,
  autoTransition = true,
}: SuccessStateProps) {
  const shouldReduceMotion = useReducedMotion();
  const { triggerSuccess } = useHapticFeedback();

  // Track if we've already started exiting (to prevent double-trigger)
  const isExiting = useRef(false);
  const autoTransitionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Entrance animation values
  const iconScale = useSharedValue(
    shouldReduceMotion ? POP_ANIMATION.finalScale : POP_ANIMATION.initialScale
  );
  const contentOpacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const contentTranslateY = useSharedValue(shouldReduceMotion ? 0 : 20);

  // Exit animation values (shared element effect)
  const iconTranslateY = useSharedValue(0);
  const iconExitScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);

  // Tap hint pulse animation values
  const tapHintOpacity = useSharedValue(0);
  const tapHintScale = useSharedValue(TAP_HINT_PULSE.minScale);

  // Progress ring animation values
  const ringOpacity = useSharedValue(1);
  const ringActive = useSharedValue(true); // Controls whether ring should animate

  // Particle burst animation values
  const burstOpacity = useSharedValue(1);

  // Display emoji - use habit emoji if provided, fallback to growth emoji
  const displayEmoji = habitEmoji || '🌿';

  // Trigger exit animation (used by both auto-transition and tap-to-skip)
  const triggerExitAnimation = useCallback(() => {
    if (isExiting.current) return;
    isExiting.current = true;

    // Clear auto-transition timeout if tapping to skip
    if (autoTransitionTimeout.current) {
      clearTimeout(autoTransitionTimeout.current);
      autoTransitionTimeout.current = null;
    }

    if (shouldReduceMotion) {
      onTransitionComplete?.();
      return;
    }

    // Freeze the progress ring animation by marking it inactive
    ringActive.value = false;

    // Fade out the progress ring during exit
    ringOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });

    // Fade out the particle burst during exit
    burstOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });

    // Shared element exit: icon floats up and shrinks, content fades
    iconTranslateY.value = withSpring(
      EXIT_TRANSITION.icon.translateY,
      EXIT_SPRING_CONFIG
    );
    iconExitScale.value = withTiming(EXIT_TRANSITION.icon.scale, {
      duration: EXIT_TRANSITION.icon.duration,
      easing: Easing.out(Easing.cubic),
    });
    contentOpacity.value = withTiming(0, {
      duration: EXIT_TRANSITION.content.duration,
      easing: Easing.out(Easing.ease),
    });
    containerOpacity.value = withDelay(
      EXIT_TRANSITION.onCompleteDelay,
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onTransitionComplete!)();
        }
      })
    );
  }, [
    shouldReduceMotion,
    onTransitionComplete,
    iconTranslateY,
    iconExitScale,
    contentOpacity,
    containerOpacity,
    ringActive,
    ringOpacity,
    burstOpacity,
  ]);

  // Tap to skip handler
  const handleTapToSkip = useCallback(() => {
    if (!autoTransition || !onTransitionComplete) return;
    triggerExitAnimation();
  }, [autoTransition, onTransitionComplete, triggerExitAnimation]);

  // Haptic feedback on mount + accessibility announcement
  useEffect(() => {
    // Trigger success haptic immediately
    triggerSuccess();

    // Announce for screen readers
    const message = `Success! ${habitName} has been added to your habits. Tap anywhere to continue.`;
    AccessibilityInfo?.announceForAccessibility?.(message);
  }, [habitName, triggerSuccess]);

  // Entrance animation
  useEffect(() => {
    // Skip animations if reduced motion is preferred
    if (shouldReduceMotion) {
      iconScale.value = POP_ANIMATION.finalScale;
      contentOpacity.value = 1;
      contentTranslateY.value = 0;
      return;
    }

    // Icon pop animation: 0.8 → 1.1 → 1.0 with bounce
    iconScale.value = withSequence(
      withTiming(POP_ANIMATION.overshootScale, {
        duration: POP_ANIMATION.duration * 0.6,
      }),
      withSpring(POP_ANIMATION.finalScale, SPRING_CONFIGS.successPop)
    );

    // Content fade in with delay
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    contentTranslateY.value = withDelay(
      200,
      withSpring(0, SPRING_CONFIGS.entrance)
    );
  }, [contentOpacity, contentTranslateY, iconScale, shouldReduceMotion]);

  // Tap hint pulse animation - fade in after delay, then pulse infinitely
  useEffect(() => {
    if (!autoTransition) return;

    // For reduced motion, just fade in to static opacity (no pulse)
    if (shouldReduceMotion) {
      tapHintOpacity.value = withDelay(
        800,
        withTiming(TAP_HINT_PULSE.maxOpacity, { duration: 300 })
      );
      tapHintScale.value = TAP_HINT_PULSE.minScale;
      return;
    }

    // Fade in after 800ms delay
    tapHintOpacity.value = withDelay(
      800,
      withSequence(
        // Initial fade in
        withTiming(TAP_HINT_PULSE.maxOpacity, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }),
        // Then start infinite pulse between minOpacity and maxOpacity
        withRepeat(
          withSequence(
            withTiming(TAP_HINT_PULSE.minOpacity, {
              duration: TAP_HINT_PULSE.duration / 2,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(TAP_HINT_PULSE.maxOpacity, {
              duration: TAP_HINT_PULSE.duration / 2,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1, // infinite
          false // don't reverse (already using sequence for back and forth)
        )
      )
    );

    // Scale pulse - starts with delay matching fade-in completion
    tapHintScale.value = withDelay(
      1100, // 800ms delay + 300ms fade-in
      withRepeat(
        withSequence(
          withTiming(TAP_HINT_PULSE.maxScale, {
            duration: TAP_HINT_PULSE.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(TAP_HINT_PULSE.minScale, {
            duration: TAP_HINT_PULSE.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite
        false
      )
    );

    return () => {
      cancelAnimation(tapHintOpacity);
      cancelAnimation(tapHintScale);
    };
  }, [autoTransition, shouldReduceMotion, tapHintOpacity, tapHintScale]);

  // Auto-transition exit animation (after celebration delay)
  useEffect(() => {
    if (!autoTransition || !onTransitionComplete) return;

    // Delay before starting exit animation (let user see the celebration)
    const celebrationDelay = 1800; // 1.8s to enjoy the moment

    autoTransitionTimeout.current = setTimeout(() => {
      triggerExitAnimation();
    }, celebrationDelay);

    return () => {
      if (autoTransitionTimeout.current) {
        clearTimeout(autoTransitionTimeout.current);
      }
      // Cancel animations on unmount
      cancelAnimation(iconTranslateY);
      cancelAnimation(iconExitScale);
      cancelAnimation(containerOpacity);
    };
  }, [
    autoTransition,
    onTransitionComplete,
    triggerExitAnimation,
    iconTranslateY,
    iconExitScale,
    containerOpacity,
  ]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value * iconExitScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const tapHintStyle = useAnimatedStyle(() => ({
    opacity: tapHintOpacity.value,
    transform: [{ scale: tapHintScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burstOpacity.value,
  }));

  return (
    <Pressable
      accessibilityHint='Skip the celebration and view your habit list'
      accessibilityLabel='Tap to continue to your habits'
      accessibilityRole='button'
      style={{ flex: 1 }}
      onPress={handleTapToSkip}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
          },
        ]}
      >
        <Confetti shouldReduceMotion={shouldReduceMotion ?? false} />

        {/* Icon Container - Wraps both progress ring and success icon */}
        <Animated.View
          style={[
            iconStyle,
            {
              alignItems: 'center',
              height: PROGRESS_RING.size,
              justifyContent: 'center',
              marginBottom: 24,
              width: PROGRESS_RING.size,
            },
          ]}
        >
          {/* Progress Ring - Behind the icon, shows countdown to auto-transition */}
          {autoTransition && (
            <Animated.View
              style={[
                ringStyle,
                {
                  height: PROGRESS_RING.size,
                  position: 'absolute',
                  width: PROGRESS_RING.size,
                },
              ]}
            >
              <ProgressRing
                duration={PROGRESS_RING.duration}
                size={PROGRESS_RING.size}
              />
            </Animated.View>
          )}

          {/* Particle Burst - Triggers on mount with icon pop, positioned behind icon */}
          <Animated.View
            style={[
              burstStyle,
              {
                height: PROGRESS_RING.size,
                position: 'absolute',
                width: PROGRESS_RING.size,
              },
            ]}
          >
            <ParticleBurst
              distance={PARTICLE_BURST.distance}
              duration={PARTICLE_BURST.duration}
            />
          </Animated.View>

          {/* Success Icon - Shows habit emoji for visual continuity */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: COLORS.successBackground,
              borderRadius: 48,
              height: 96,
              justifyContent: 'center',
              width: 96,
              zIndex: 10,
            }}
          >
            <Text style={{ fontSize: 48 }}>{displayEmoji}</Text>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[contentStyle, { alignItems: 'center', width: '100%' }]}
        >
          {/* Headline */}
          <Text
            style={{
              color: COLORS.stone800,
              fontSize: 24,
              fontWeight: '700',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {COPY.successHeadline}
          </Text>

          {/* Subtext */}
          <Text
            style={{
              color: COLORS.stone500,
              fontSize: 13,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            {COPY.successSubtext(habitName)}
          </Text>

          {/* Tap to continue hint - only show if auto-transitioning */}
          {autoTransition && (
            <Animated.Text
              style={[
                tapHintStyle,
                {
                  color: COLORS.stone500,
                  fontSize: 13,
                  textAlign: 'center',
                },
              ]}
            >
              Tap anywhere to continue
            </Animated.Text>
          )}

          {/* Add another button - only show if not auto-transitioning */}
          {!autoTransition && (
            <Pressable
              accessibilityHint='Creates another habit'
              accessibilityLabel={COPY.addAnother}
              accessibilityRole='button'
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: COLORS.stone800,
                borderRadius: BORDER_RADIUS.cta,
                height: TOUCH_TARGETS.ctaHeight,
                justifyContent: 'center',
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                width: '100%',
              })}
              onPress={onAddAnother}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: '700',
                }}
              >
                {COPY.addAnother}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
