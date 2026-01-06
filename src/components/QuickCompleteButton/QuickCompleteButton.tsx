/**
 * QuickCompleteButton Component
 * Primary action button for marking a habit complete
 *
 * Features:
 * - Confetti burst animation on completion (T1.3)
 * - Check icon animation
 * - Haptic feedback
 * - Respects reduce motion accessibility setting
 */

import React, { useState, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Check, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface QuickCompleteButtonProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  habitName: string;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Confetti particle colors - celebratory emerald/green theme with accent colors
 */
const CONFETTI_COLORS = [
  '#10B981', // Emerald 500 (primary)
  '#34D399', // Emerald 400
  '#6EE7B7', // Emerald 300
  '#059669', // Emerald 600
  '#F59E0B', // Amber (gold accent)
  '#FBBF24', // Yellow (celebration)
];

/**
 * Number of confetti particles to render
 */
const PARTICLE_COUNT = 12;

/**
 * ConfettiBurst Component
 * Renders a burst of confetti particles emanating from a central point
 */
function ConfettiBurst({ isActive }: { isActive: boolean }) {
  // Create shared values for each particle
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY: useSharedValue(0),
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),
    // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
    distance: Math.round(40 + Math.random() * 30),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: Math.round(4 + Math.random() * 4),
  }));

  React.useEffect(() => {
    if (isActive) {
      // Animate each particle outward with burst effect
      particles.forEach((particle, i) => {
        const delay = i * 15; // Stagger particles slightly
        // Round to avoid "Loss of precision during arithmetic conversion" error
        const targetX = Math.round(Math.cos(particle.angle) * particle.distance);
        const targetY = Math.round(Math.sin(particle.angle) * particle.distance) - 20; // Bias upward

        // Reset to center
        particle.translateX.value = 0;
        particle.translateY.value = 0;
        particle.scale.value = 0;
        particle.opacity.value = 0;

        // Animate outward with spring physics
        particle.translateX.value = withDelay(
          delay,
          withSpring(targetX, { damping: 12, stiffness: 200, mass: 1 })
        );
        particle.translateY.value = withDelay(
          delay,
          withSpring(targetY, { damping: 12, stiffness: 200, mass: 1 })
        );
        particle.scale.value = withDelay(
          delay,
          withSequence(
            withSpring(1.2, { damping: 8, stiffness: 300 }),
            withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
          )
        );
        particle.opacity.value = withDelay(
          delay,
          withSequence(
            withTiming(1, { duration: 50 }),
            withDelay(200, withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }))
          )
        );
      });
    }
  }, [isActive]);

  // Create animated styles for each particle
  const particleStyles = particles.map((particle) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      opacity: particle.opacity.value,
      transform: [
        { translateX: particle.translateX.value },
        { translateY: particle.translateY.value },
        { scale: particle.scale.value },
      ],
    }))
  );

  if (!isActive) return null;

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
            },
            particleStyles[i],
          ]}
        />
      ))}
    </View>
  );
}

export function QuickCompleteButton({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: QuickCompleteButtonProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(completedToday);
  const [showConfetti, setShowConfetti] = useState(false);
  const reduceMotion = useReduceMotion();

  const buttonScale = useSharedValue(1);
  const checkScale = useSharedValue(completedToday ? 1 : 0);
  const checkRotation = useSharedValue(completedToday ? 0 : -90);

  const toggleCompletionMutation = useMutation(api.habits.toggleHabit);
  const today = new Date().toISOString().split('T')[0];

  React.useEffect(() => {
    setLocalCompleted(completedToday);
    checkScale.value = completedToday ? 1 : 0;
    checkRotation.value = completedToday ? 0 : -90;
  }, [completedToday]);

  const handlePress = async () => {
    if (isToggling) return;

    setIsToggling(true);

    // Haptic feedback
    Haptics.impactAsync(
      localCompleted
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Heavy
    );

    // Button animation
    buttonScale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Optimistic update
    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (!wasCompleted) {
      checkScale.value = withSequence(
        withSpring(1.3, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      );
      checkRotation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      // Trigger confetti burst animation (T1.3)
      // Respects reduce motion accessibility setting
      if (!reduceMotion) {
        setShowConfetti(true);
        // Auto-hide confetti after animation completes
        setTimeout(() => setShowConfetti(false), 700);
      }

      onComplete?.();
    } else {
      checkScale.value = withTiming(0, { duration: 150 });
      checkRotation.value = withTiming(-90, { duration: 150 });
      onUncomplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
    } catch (error) {
      setLocalCompleted(wasCompleted);
      checkScale.value = wasCompleted ? 1 : 0;
      checkRotation.value = wasCompleted ? 0 : -90;
      console.error('Failed to toggle completion:', error);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
      { rotate: `${Math.round(checkRotation.value)}deg` },
    ],
    opacity: checkScale.value,
  }));

  return (
    <View style={styles.buttonWrapper}>
      {/* Confetti burst animation on completion (T1.3) */}
      <ConfettiBurst isActive={showConfetti} />

      <AnimatedPressable
        accessibilityHint={
          localCompleted
            ? 'Double tap to mark as not complete'
            : 'Double tap to mark as complete'
        }
        accessibilityLabel={
          localCompleted
            ? `${habitName} completed today. Tap to undo.`
            : `Mark ${habitName} complete for today`
        }
        accessibilityRole="button"
        accessibilityState={{ checked: localCompleted }}
        className={`
          flex-row items-center justify-center gap-3 rounded-2xl px-6 py-5
          ${localCompleted
            ? 'border-2 border-emerald-200 bg-emerald-50'
            : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
          }
        `}
        disabled={isToggling}
        onPress={handlePress}
        style={buttonAnimatedStyle}
      >
        <View className="relative h-7 w-7 items-center justify-center">
          {localCompleted ? (
            <Animated.View style={checkAnimatedStyle}>
              <Check className="text-emerald-600" size={28} strokeWidth={3} />
            </Animated.View>
          ) : (
            <Zap className="text-white" fill="white" size={24} />
          )}
        </View>

        <Text
          className={`text-[15px] font-semibold ${
            localCompleted ? 'text-emerald-700' : 'text-white'
          }`}
        >
          {localCompleted ? 'Done for Today' : 'Complete Today'}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

/**
 * Styles for confetti animation (T1.3)
 */
const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  confettiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    zIndex: 100,
    pointerEvents: 'none',
  },
  confettiParticle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default QuickCompleteButton;






